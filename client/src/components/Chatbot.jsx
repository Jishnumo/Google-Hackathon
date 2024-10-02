import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import facescannobg from "../assets/facescannobg.gif";

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome! How can I assist you today?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [showGif, setShowGif] = useState(true); // State to control GIF visibility

  // Ref to manage auto-scrolling to the latest message
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    // Scroll to the bottom whenever messages are updated
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    // Hide the GIF after 3 seconds (adjust to match GIF duration)
    const timer = setTimeout(() => {
      setShowGif(false);
    }, 5985); 

    return () => clearTimeout(timer); // Cleanup timer on component unmount
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
      className="fixed inset-0 h-screen w-screen z-50 bg-gradient-to-br flex items-center justify-center"
      style={{ zIndex: 9999 }} // Ensures it's on top of everything
    >
      {/* Face ID Animation at the top, visible only if showGif is true */}
      {showGif && (
        <div className="absolute top-0 w-full flex justify-center pt-4">
          <img
            src={facescannobg} // Replace with correct path
            alt="Face ID Animation"
            className="w-20 h-20" // Adjust width and height as needed
          />
        </div>
      )}

      {/* Main Chatbox Content */}
      <div className="w-full h-5/6 max-w-4xl shadow-2xl rounded-xl flex flex-col overflow-hidden mt-28">
        {/* Chat Display */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
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
          <div ref={messagesEndRef} /> {/* Auto-scroll target */}
        </div>

        {/* Input Area */}
        <div className="mb-10 flex items-center justify-between">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow p-5 bg-gray-100 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            style={{ color: "black" }}
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 bg-indigo-600 text-white py-5 px-8 rounded-full hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
