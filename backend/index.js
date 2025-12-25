const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const userSockets = new Map();
const onlineUsers = new Set();

io.on("connection", (socket) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.log("Missing token, disconnecting");
      socket.disconnect();
      return;
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const userId = payload.sub;

    socket.data.userId = userId;
    const wasOffline = !onlineUsers.has(userId);
    addSocketToUserMap(userId, socket.id);
    onlineUsers.add(userId);

    if (wasOffline) {
      console.log("🟢 User online:", userId);
      io.emit("userOnline", { userId });
    }
    console.log("Authenticated user:", userId, socket.id);
    socket.on("disconnect", () => {
      const userId = socket.data.userId;
      if (!userId) return;

      removeSocketFromUserMap(socket);

      const sockets = userSockets.get(userId);

      // Still has active sockets → still online
      if (sockets && sockets.size > 0) {
        return;
      }

      // Last socket gone → user offline
      onlineUsers.delete(userId);

      console.log("🔴 User offline:", userId);
      io.emit("userOffline", { userId });
    });

    socket.on("sendMessage", ({ chatId, text }) => {
      if (!chatId || !text) return;
      const senderId = socket.data.userId;
      console.log(`Message in ${chatId} from ${senderId}: ${text}`);
      io.to(chatId).emit("receiveMessage", {
        chatId,
        senderId,
        text,
      });
    });
    socket.on("joinChat", ({ otherUserId }) => {
      if (!otherUserId) return;
      const userId = socket.data.userId;
      const chatId = getChatId(userId, otherUserId);
      socket.join(chatId);
      console.log(`${userId} joined chat ${chatId}`);
      socket.emit("joinedChat", { chatId });
    });

    socket.on("typing", ({ chatId }) => {
      if (!chatId) return;
      const userId = socket.data.userId;
      // Broadcast to everyone in the chat room except the sender
      socket.to(chatId).emit("peerTyping", { chatId, userId });
    });

    socket.on("stopTyping", ({ chatId }) => {
      if (!chatId) return;
      const userId = socket.data.userId;
      socket.to(chatId).emit("peerStoppedTyping", { chatId, userId });
    });
  } catch (err) {
    console.log("❌ Invalid token:", err.message);
    socket.disconnect();
  }
});

function addSocketToUserMap(userId, socketId) {
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }
  userSockets.get(userId).add(socketId);
}

function removeSocketFromUserMap(socket) {
  const userId = socket.data.userId;
  if (!userId) return;

  const sockets = userSockets.get(userId);
  if (!sockets) return;

  sockets.delete(socket.id);

  if (sockets.size === 0) {
    userSockets.delete(userId);
  }
}
function getChatId(userA, userB) {
  return [userA, userB].sort().join(":");
}

function emitToUser(userId, event, payload) {
  const socketSet = userSockets.get(userId);
  if (!socketSet) return;
  socketSet.forEach((socketId) => {
    io.to(socketId).emit(event, payload);
  });
}

app.get("/", (req, res) => {
  res.send("WebSocket server is running");
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
