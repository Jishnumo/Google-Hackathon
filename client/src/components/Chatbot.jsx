import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Chatbot({ initialEmotion }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false); // New state to handle loading
  const messagesEndRef = useRef(null);

  // Scroll to the last message whenever messages are updated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Store initial emotion in session storage
  useEffect(() => {
    if (initialEmotion) {
      sessionStorage.setItem("detectedEmotion", initialEmotion); // Store the emotion
      const initialResponse = generateInitialResponse(initialEmotion);
      setMessages([{ sender: "bot", text: initialResponse }]); // Set the first message directly
    }
  }, [initialEmotion]);

  // Generate initial bot response based on the detected emotion
  const generateInitialResponse = (emotion) => {
    switch (emotion) {
      case "happy":
        return "I'm glad to see you happy! What made you smile today?";
      case "sad":
        return "I see you're feeling a bit sad. Is there anything you'd like to talk about?";
      case "angry":
        return "It seems like something is bothering you. Want to share what's on your mind?";
      case "surprised":
        return "Wow! You look surprised. What caught you off guard?";
      case "neutral":
        return "You seem calm. How can I assist you today?";
      case "fearless":
        return "That's great to hear! Being fearless is a wonderful mindset. What's driving that confidence?";
      case "anxious":
        return "I understand that feeling anxious can be tough. Is there something specific that's on your mind?";
      case "excited":
        return "Excitement is contagious! What are you looking forward to?";
      case "bored":
        return "Feeling bored? Let's change that! What would you like to talk about or do?";
      case "confused":
        return "Confusion can be overwhelming. What seems to be puzzling you right now?";
      case "overwhelmed":
        return "It sounds like you're feeling a bit overwhelmed. Do you want to talk about what's on your plate?";
      default:
        return "Hello! How can I help you today?";
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === "" || loading) return; // Prevent sending if empty or still loading

    // Add user's message to the chat and clear the input immediately
    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput(""); // Clear the input immediately

    setLoading(true); // Set loading to true to disable input

    // Retrieve the detected emotion from session storage
    const detectedEmotion = sessionStorage.getItem("detectedEmotion");

    try {
      const response = await axios.post("http://localhost:3000/api/chatbot", {
        message: userInput,
        emotion: detectedEmotion, // Send the detected emotion
      });

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

    setLoading(false); // Re-enable input after the response is received
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) { // Only allow sending if not loading
      e.preventDefault(); // Prevent the default action (form submission)
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen z-50 bg-gradient-to-br flex items-center justify-center">
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

        <div className="mb-10 flex items-center justify-between px-5">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading} // Disable input when waiting for a response
            className="flex-grow p-5 bg-gray-100 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            style={{ color: "black" }}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading} // Disable button when waiting for a response
            className={`ml-4 py-5 px-8 rounded-full transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
