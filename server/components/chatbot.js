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
          parts: [
            {
              text: `You are a mental well-being chatbot. User emotion: "${detectedEmotion}". respond empathetically based on that emotion.
               Your responses should
              1. Show Understanding: Acknowledge the user's feelings. 
              2. Encourage Sharing: Ask follow-up questions to invite the user to elaborate. 
              3. Be Light-Hearted: Incorporate relevant jokes or uplifting comments when appropriate. 
              4. Provide Support: Offer comforting advice or motivational quotes. 
              5. Be Human-like: Ensure your tone is warm and relatable. 
              6. Contextual Memory: Remember previous user interactions to personalize responses. 
              7. Identify Serious Concerns: If the user expresses thoughts of self-harm or suicide, gently encourage them to seek professional help and validate their feelings. 
              `,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 150, // Adjust token limit based on your requirements
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
