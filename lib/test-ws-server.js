import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  auth: {
    userId: "User A",
  },
});
// 👇 TEMP: expose for DevTools
if (typeof window !== "undefined") {
  // @ts-ignore
  window.socket = socket;
}
socket.emit("joinChat", {
  otherUserId: "userA",
});
socket.on("joinedChat", ({ chatId }) => {
  console.log("Joined chat:", chatId);
  window.currentChatId = chatId; // TEMP for testing
});
socket.on("receiveMessage", ({ senderId, text }) => {
  console.log(`📩 ${senderId}: ${text}`);
});

socket.on("connect", () => {
  console.log("🟢 Frontend connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("🔴 Frontend disconnected");
});

export default socket;
