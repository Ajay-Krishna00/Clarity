"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { MessageCircle, User } from "lucide-react";

function RecentChat({ authToken }) {
  const router = useRouter();
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    }
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    async function fetchRecentChats() {
      setLoading(true);
      try {
        // Fetch messages where current user is sender or receiver
        const { data: messages, error } = await supabase
          .from("messages")
          .select("*")
          .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching messages:", error);
          setLoading(false);
          return;
        }

        // Group messages by chat partner and get the latest message for each
        const chatMap = new Map();

        messages?.forEach((msg) => {
          const partnerId =
            msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;

          if (!chatMap.has(partnerId)) {
            chatMap.set(partnerId, {
              odashboard: partnerId,
              peerId: partnerId,
              lastMessage: msg.text || msg.content,
              timestamp: msg.created_at,
              isOwn: msg.sender_id === currentUserId,
              unreadCount: 0, // You can implement unread logic later
            });
          }
        });

        setRecentChats(Array.from(chatMap.values()));
      } catch (err) {
        console.error("Failed to fetch recent chats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentChats();

    // Subscribe to new messages in real-time
    const channel = supabase
      .channel("recent-chats")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new;
          if (
            msg.sender_id === currentUserId ||
            msg.receiver_id === currentUserId
          ) {
            fetchRecentChats(); // Refresh the list
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // Format timestamp like WhatsApp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      // Within a week - show day name
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  // Truncate message for preview
  const truncateMessage = (message, maxLength = 40) => {
    if (!message) return "No messages yet";
    return message.length > maxLength
      ? message.substring(0, maxLength) + "..."
      : message;
  };

  const handleChatClick = (peerId) => {
    router.push(`/peer-chat?peer=${peerId}`);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 w-full">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-6 h-6 text-indigo-500" />
        <h2 className="text-2xl md:text-3xl text-indigo-500 font-bold">
          Chats
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : recentChats.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No conversations yet</p>
          <p className="text-gray-400 text-sm">
            Start chatting with your peers!
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {recentChats.map((chat) => (
            <li
              key={chat.peerId}
              onClick={() => handleChatClick(chat.peerId)}
              className="p-4 bg-gray-50 hover:bg-indigo-50 rounded-xl border border-gray-200 cursor-pointer transition-all duration-200 hover:border-indigo-300 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>

                {/* Chat info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-800 truncate">
                      Anonymous {chat.peerId.slice(1, 3)}
                      {chat.peerId.slice(-4)}
                    </p>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatTime(chat.timestamp)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {chat.isOwn && (
                        <span className="text-gray-400">You: </span>
                      )}
                      {truncateMessage(chat.lastMessage)}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecentChat;
