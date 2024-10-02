import React, { useState, useEffect } from "react";
import axios from "axios";

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome! How can I assist you today?" },
  ]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    // Hide navbar and logo of the previous page
    const navbar = document.getElementById("navbar");
    const logo = document.getElementById("logo");
    if (navbar) {
      navbar.style.display = "none"; // Hide navbar
    }
    if (logo) {
      logo.style.display = "none"; // Hide logo
    }

    // Restore navbar and logo when component is unmounted
    return () => {
      if (navbar) {
        navbar.style.display = "block";
      }
      if (logo) {
        logo.style.display = "block";
      }
    };
  }, []);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    // Add user's message to the chat
    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);

    try {
      const response = await axios.post("/api/chatbot", { message: userInput });
      const botResponse = response.data.reply;

      // Add bot's response to the chat
      setMessages([...newMessages, { sender: "bot", text: botResponse }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Error: Unable to reach the server." },
      ]);
    }

    setUserInput(""); // Clear input
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div
      className="fixed inset-0 h-screen w-screen z-50 bg-gradient-to-br from-purple-700 via-pink-500 to-indigo-500 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }} // Ensures it's on top of everything
    >
      <div className="h-full w-full max-w-4xl bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden">
        {/* Chat Display */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-tl from-gray-100 via-gray-50 to-white">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs p-4 rounded-lg shadow ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4 flex items-center justify-between">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow p-3 bg-gray-100 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            style={{ color: "black" }}
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 bg-indigo-600 text-white py-3 px-6 rounded-full hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
