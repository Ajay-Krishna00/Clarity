"use client"
import React, { useState } from 'react'
import { IoArrowBackOutline } from "react-icons/io5";

const page = () => {
  const [messages, setMessages] = useState([["Hello! How can I assist you today?", "bot"]]);
  
  const handleSend = () => {
    const input = document.getElementById("user-input");
    const userMessage = input.value;
    if (userMessage.trim()) {
      setMessages((prevMessages) => [...prevMessages, [userMessage, "user"]]);
      input.value = "";
    }
  }

  return (
      <div  className='flex flex-col bg-white w-screen h-screen py-5 px-10 gap-5'>
      <div className='flex items-center border-b border-gray-300'>
        <a href='/'><IoArrowBackOutline size={30} className='text-black mr-2 hover:text-gray-600'/></a>
          <img src="/boy.png" alt="Avatar" className="w-20 h-20" />
        <h1 className='text-4xl font-bold mb-4 text-center ml-2 text-black'>Buzz</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 border-2 border-gray-300 rounded-lg flex flex-col">
        {messages.map((msg, index) => (
          msg[1] === "bot" ? (
          <div key={index} className="bg-blue-100 p-2 rounded-lg max-w-3xl self-start">
            <p className="text-black">{msg[0]}</p>
            </div>
          ) : (
          <div key={index} className="bg-gray-100 p-2 rounded-lg max-w-3xl self-end">
            <p className="text-black">{msg[0]}</p>
          </div>
        )
        ))}
        </div>

          <div className="flex p-4 border-t border-gray-300">
        <input
            id="user-input"
            type="text"
            className="flex-1 border rounded-lg px-3 py-2 text-black"
            placeholder="Type your message..."
          />
          <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
  )
}

export default page