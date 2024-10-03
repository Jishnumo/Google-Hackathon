import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import facescannobg from "../assets/facescannobg.gif";

function Chatbot({ detectedEmotions }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [showGif, setShowGif] = useState(true);
  const messagesEndRef = useRef(null);

  // Scroll to the last message whenever messages are updated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle the initial response based on detected emotions
  useEffect(() => {
    if (detectedEmotions && detectedEmotions.length > 0) {
      const initialResponse = `I’ve detected that you are feeling ${detectedEmotions.join(", ")}. How can I assist you today?`;
      setMessages([{ sender: "bot", text: initialResponse }]); // Set the first message directly
      setShowGif(false); // Hide the GIF once the response is displayed
    }
  }, [detectedEmotions]);

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    // Add user's message to the chat
    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);

    try {
      const response = await axios.post("/api/chatbot", { message: userInput });
      const botResponse = response.data.reply;

      // Add bot's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: botResponse },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Error: Unable to reach the server." },
      ]);
    }

    setUserInput(""); // Clear the input field
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen z-50 bg-gradient-to-br flex items-center justify-center">
      {showGif && (
        <div className="absolute top-0 w-full flex justify-center pt-4">
          <img src={facescannobg} alt="Face ID Animation" className="w-20 h-20" />
        </div>
      )}
      <div className="w-full h-5/6 max-w-4xl shadow-2xl rounded-xl flex flex-col overflow-hidden mt-28">
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
          <div ref={messagesEndRef} />
        </div>

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
