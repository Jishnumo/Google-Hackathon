import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import facescannobg from "../assets/facescannobg.gif";

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome! How can I assist you today?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [showGif, setShowGif] = useState(true);
  const [detectedEmotion, setDetectedEmotion] = useState(""); // Store detected emotion

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Automatically scroll to the bottom of chat when messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    // Hide the GIF after 3 seconds (adjust based on your GIF length)
    const timer = setTimeout(() => {
      setShowGif(false);
    }, 6000); // 6 seconds for example

    // Fetch emotion and chatbot response from backend after image analysis
    getEmotionAndResponseFromBackend();

    return () => clearTimeout(timer); // Cleanup on component unmount
  }, []);

  // Fetch emotion and chatbot response from backend after image analysis
  const getEmotionAndResponseFromBackend = async () => {
    try {
      const response = await axios.post("/api/emotion-check");
      if (response.status === 200) {
        const { emotion, message } = response.data;
        setDetectedEmotion(emotion); // Store detected emotion

        // Add the initial emotion-based response to the chat
        const initialResponse = `It seems you're feeling ${emotion}. How can I help you today?`;
        setMessages([...messages, { sender: "bot", text: initialResponse }, { sender: "bot", text: message }]);
      }
    } catch (error) {
      console.error("Error fetching emotion: ", error);
      setMessages([
        ...messages,
        { sender: "bot", text: "Sorry, I couldn't detect your emotion." },
      ]);
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    // Add user's message to the chat
    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);

    try {
      // Send user's message to backend and get AI-generated response
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

    setUserInput(""); // Clear the input field
  };

  // Trigger message sending on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen z-50 bg-gradient-to-br flex items-center justify-center">
      {/* Face ID Animation at the top, visible only if showGif is true */}
      {showGif && (
        <div className="absolute top-0 w-full flex justify-center pt-4">
          <img src={facescannobg} alt="Face ID Animation" className="w-20 h-20" />
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
