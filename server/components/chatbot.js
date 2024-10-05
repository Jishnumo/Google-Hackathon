const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const router = express.Router();

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Create a chatbot route
router.post("/", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const detectedEmotion = req.body.emotion; // Get emotion from request body

    // Check if the user message is present
    if (!userMessage) {
      return res.status(400).json({ reply: "Please send a message." });
    }

    // Initialize the chat with a history for emotion detection
    const chat = genAI.getGenerativeModel({ model: "gemini-pro" }).startChat({
      history: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
        {
          role: "model",
          parts: [{ text: `The user is feeling ${detectedEmotion}. How can I assist you with their emotions today?` }], // Use detected emotion in prompt
        },
      ],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    // Get the bot's response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const botReply = response.text();

    // Send the bot's reply back to the client
    return res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error("Error in chatbot route:", error);
    return res.status(500).json({ reply: "An error occurred while processing your message." });
  }
});

module.exports = router;
