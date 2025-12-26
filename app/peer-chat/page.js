"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { io } from "socket.io-client";
import {
  ArrowLeft,
  Send,
  Users,
  Shield,
  Minimize2,
  Maximize2,
} from "lucide-react";
import Link from "next/link";

function PeerChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the peer's userId from URL query param (e.g., /peer-chat?peer=abc123)
  const peerId = searchParams.get("peer");

  // Auth state
  const [authToken, setAuthToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [peerOnline, setPeerOnline] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const [readReceipts, setReadReceipts] = useState({}); 

  const messagesEndRef = useRef(null);// For auto-scrolling to latest message
  const socketRef = useRef(null); // Holds the socket instance
  const typingTimeoutRef = useRef(null); //Debounces "stop typing" events

  // Auth setup - get session and user
  useEffect(() => {
    let mounted = true;

    async function syncSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!mounted) return;

      if (!session) {
        router.replace("/signin");
        return;
      }

      setAuthToken(session.access_token);
      setUser(session.user);
      setAuthReady(true);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (!session) {
        router.replace("/signin");
        return;
      }

      setAuthToken(session.access_token);
      setUser(session.user);
      setAuthReady(true);
    });

    syncSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  // Load previous messages from Supabase
  useEffect(() => {
    if (!user?.id || !peerId) return;

    async function loadMessages() {
      try {
        // Generate chatId the same way as the server
        const chatId = [user.id, peerId].sort().join(":");

        const { data: messages, error } = await supabase
          .from("messages")
          .select("*")
          .eq("chat_id", chatId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error loading messages:", error);
          return;
        }

        if (messages && messages.length > 0) {
          const formattedMessages = messages.map((msg) => ({
            id: msg.id,
            text: msg.text || msg.content,
            senderId: msg.sender_id,
            isOwn: msg.sender_id === user.id,
            timestamp: msg.created_at,
            read_at: msg.read_at,
          }));
          setMessages(formattedMessages);
          
          // Also load read receipts for own messages that have been read
          const readOwnMessages = messages.filter(m => m.sender_id === user.id && m.read_at);
          if (readOwnMessages.length > 0) {
            setReadReceipts(prev => {
              const updated = { ...prev };
              readOwnMessages.forEach(m => {
                updated[m.id] = m.read_at;
              });
              return updated;
            });
          }
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    }

    loadMessages();
  }, [user?.id, peerId]);

  // Socket connection and event handlers
  useEffect(() => {
    if (!authReady || !authToken || !peerId) return;

    // const socket = io("http://localhost:4000", {
    const socket = io("https://clarity-r77f.onrender.com", {
      auth: { token: authToken },
    });
    socketRef.current = socket;

    // Connection established
    socket.on("connect", () => {
      console.log("🟢 Connected with socket:", socket.id);
      setConnected(true);

      // Join the chat room with this peer
      socket.emit("joinChat", { otherUserId: peerId });
    });

    // Received confirmation of joining chat
    socket.on("joinedChat", ({ chatId: joinedChatId }) => {
      console.log("📬 Joined chat:", joinedChatId);
      setChatId(joinedChatId);
    });

    // Receive messages from the peer (only add if not from self - avoid duplicates)
    socket.on(
      "receiveMessage",
      ({ chatId: msgChatId, senderId, text, timestamp, messageId }) => {
        if (senderId === user?.id) return; // Skip own messages (already added optimistically)

        console.log("📩 Received message:", { senderId, text });
        setMessages((prev) => [
          ...prev,
          {
            id: messageId,
            text,
            senderId,
            isOwn: false,
            timestamp: timestamp || new Date().toISOString(),
          },
        ]);
      },
    );

    // Peer online/offline status
    socket.on("userOnline", ({ userId }) => {
      if (userId === peerId) {
        console.log(`🟢 Peer ${peerId} is online`);
        setPeerOnline(true);
      }
    });

    socket.on("userOffline", ({ userId }) => {
      if (userId === peerId) {
        console.log(`🔴 Peer ${peerId} is offline`);
        setPeerOnline(false);
      }
    });

    // Typing indicators
    socket.on("peerTyping", ({ chatId: typingChatId, userId }) => {
      if (userId === peerId) {
        setPeerTyping(true);
      }
    });

    socket.on("peerStoppedTyping", ({ chatId: typingChatId, userId }) => {
      if (userId === peerId) {
        setPeerTyping(false);
      }
    });

    // when peer reads our messages
    socket.on("messagesRead", ({ chatId: readChatId, messageIds, readBy, readAt }) => {
      if (readBy === peerId) {
        console.log(`📖 Peer read ${messageIds.length} message(s)`);
        setReadReceipts((prev) => {
          const updated = { ...prev };
          messageIds.forEach((id) => {
            updated[id] = readAt;
          });
          return updated;
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from socket");
      setConnected(false);
    });

    // Cleanup on unmount or token/peer change
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authReady, authToken, peerId, user?.id]);

  // Mark messages as read when viewing the chat
  useEffect(() => {
    if (!chatId || !socketRef.current || !user?.id) return;
    // Find unread messages from the peer (not our own messages)
    const unreadMessageIds = messages
      .filter(msg => !msg.isOwn && !msg.read_at && msg.id)
      .map(msg => msg.id);
    if (unreadMessageIds.length === 0) return;
    socketRef.current.emit("markAsRead", { chatId, messageIds: unreadMessageIds });
    supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .in("id", unreadMessageIds)
      .eq("receiver_id", user.id)
      .then(() => {
        // Update local state to mark as read
        setMessages(prev => prev.map(msg => 
          unreadMessageIds.includes(msg.id) 
            ? { ...msg, read_at: new Date().toISOString() }
            : msg
        ));
      });
  }, [chatId, messages, user?.id]);

  // Auto scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Send message via WebSocket
  const handleSend = async () => {
    if (!inputValue.trim() || !chatId || !socketRef.current) return;

    const text = inputValue.trim();
    const timestamp = new Date().toISOString();
    const messageId = crypto.randomUUID(); // Generate unique ID for this message

    // Emit message to server
    socketRef.current.emit("sendMessage", { chatId, text, receiverId: peerId, messageId });

    // Add message to local state immediately (optimistic update)
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        text,
        senderId: user?.id,
        isOwn: true,
        timestamp,
      },
    ]);

    setInputValue("");

    // Stop typing indicator
    socketRef.current.emit("stopTyping", { chatId });

    // Save message to Supabase with the same ID
    try {
      await supabase.from("messages").insert({
        id: messageId,
        sender_id: user?.id,
        receiver_id: peerId,
        text,
        chat_id: chatId,
        created_at: timestamp,
      });
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    if (!chatId || !socketRef.current) return;

    // Emit typing event
    socketRef.current.emit("typing", { chatId });

    // Clear previous timeout and set new one to stop typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stopTyping", { chatId });
    }, 1000);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Loading state
  if (!user || !authReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  // No peer specified
  if (!peerId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Users className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          No Peer Selected
        </h2>
        <p className="text-gray-500 mb-4">
          Please select a peer to start chatting.
        </p>
        <Link
          href="/peers"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Find Peers
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-screen h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <Link
              href="/peers"
              className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft
                size={20}
                className="text-gray-600 hover:text-gray-800"
              />
            </Link>

            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mr-3">
              <Users className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Peer Chat
              </h1>
              <div className="flex items-center text-sm text-gray-500">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    peerOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <span>
                  {peerOnline ? "Online" : "Offline"}
                  {peerTyping && " • Typing..."}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`hidden sm:flex items-center px-3 py-1 rounded-full ${
                connected ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <Shield
                className={`w-4 h-4 mr-1 ${
                  connected ? "text-green-600" : "text-red-600"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  connected ? "text-green-700" : "text-red-700"
                }`}
              >
                {connected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              {isMinimized ? (
                <Maximize2 size={18} className="text-gray-600" />
              ) : (
                <Minimize2 size={18} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      {!isMinimized ? (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No messages yet. Say hello to start the conversation!
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start max-w-3xl ${
                      msg.isOwn ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 ${msg.isOwn ? "ml-3" : "mr-3"}`}
                    >
                      {msg.isOwn ? (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium text-sm">
                            You
                          </span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    <div
                      className={`relative px-4 py-3 rounded-2xl shadow-sm ${
                        msg.isOwn
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span
                          className={`text-xs ${
                            msg.isOwn ? "text-indigo-200" : "text-gray-400"
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {msg.isOwn && (
                          <span className="text-xs ml-2">
                            {readReceipts[msg.id] || msg.read_at ? (
                              <span className="text-green-300 font-bold" title="Read">✓✓</span>
                            ) : (
                              <span className="text-white font-bold" title="Sent">✓</span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {peerTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          Peer is typing...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none max-h-32 min-h-[48px]"
                    placeholder="Type a message..."
                    disabled={!connected}
                    rows="1"
                    style={{ height: "auto" }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                </div>

                <button
                  onClick={handleSend}
                  disabled={!connected || !inputValue.trim()}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-3 rounded-2xl hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex-shrink-0"
                >
                  <Send size={20} />
                </button>
              </div>

              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  🔒 This peer chat is private and secure
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Minimized state
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chat Minimized
            </h3>
            <p className="text-gray-600 mb-4">
              Click the expand button to continue your conversation
            </p>
            <button
              onClick={() => setIsMinimized(false)}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Resume Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function PeerChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </div>
      }
    >
      <PeerChatContent />
    </Suspense>
  );
}