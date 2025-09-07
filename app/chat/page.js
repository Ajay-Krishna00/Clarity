"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  Send,
  Heart,
  Shield,
  Minimize2,
  Maximize2,
} from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([
    [
      "Hello! I'm here to support you. How are you feeling today? Remember, this is a safe and confidential space.",
      "model",
    ],
  ]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  // 🔒 Auth check
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/signin");
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router]);

  // 🔽 Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // 📨 Send message
  const sendMessageToG = async (messagesToSend) => {
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messagesToSend, userId: user?.id }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setMessages((prev) => [...prev, [data.reply, "model"]]);
    } catch (err) {
      console.error("Error fetching reply:", err);
      setMessages((prev) => [
        ...prev,
        [
          "I apologize, but I'm having trouble connecting right now. Please try again later. If you're in crisis, call 988.",
          "model",
        ],
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    setLoading(true);
    const userMessage = inputValue.trim();
    const newMessages = [...messages, [userMessage, "user"]];

    setMessages(newMessages);
    setInputValue("");

    await sendMessageToG(newMessages);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  // ✅ If user exists, show chat UI
  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-screen h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <Link
              href="/"
              className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft
                size={20}
                className="text-gray-600 hover:text-gray-800"
              />
            </Link>

            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <Heart className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Clarity Support
              </h1>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Online • Confidential Chat</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center bg-green-50 px-3 py-1 rounded-full">
              <Shield className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-700 font-medium">Secure</span>
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
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg[1] === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start max-w-3xl ${
                      msg[1] === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 ${
                        msg[1] === "user" ? "ml-3" : "mr-3"
                      }`}
                    >
                      {msg[1] === "model" ? (
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium text-sm">
                            You
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className={`relative px-4 py-3 rounded-2xl shadow-sm ${
                        msg[1] === "model"
                          ? "bg-white border border-gray-200 text-gray-800"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {msg[0]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          Clarity is typing...
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
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none max-h-32 min-h-[48px]"
                    placeholder="Share what's on your mind..."
                    disabled={loading}
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
                  disabled={loading || !inputValue.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex-shrink-0"
                >
                  <Send size={20} />
                </button>
              </div>

              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  🔒 This chat is encrypted and confidential •{" "}
                  <span className="text-red-600 font-medium">
                    Crisis? Call 14416
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Minimized
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chat Minimized
            </h3>
            <p className="text-gray-600 mb-4">
              Click the expand button to continue your conversation
            </p>
            <button
              onClick={() => setIsMinimized(false)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Resume Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
