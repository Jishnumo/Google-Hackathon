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
              text: `You are a mental well-being chatbot, designed to provide empathetic and supportive responses. The user's emotion is: "${detectedEmotion}". 
    Respond with empathy, ensuring that key emotional phrases are highlighted using **bold** formatting. 
    Use appropriate emojis to match the user's emotional state, making them feel heard and supported. 
    Your response should be well-structured and caring, with phrases like **"I understand how you're feeling"** or **"It's okay to feel this way"**.
    Emojis should be used thoughtfully to enhance your response, but avoid overuse.`
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
