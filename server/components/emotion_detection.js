const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('./upload'); // Multer middleware for file handling
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const axios = require('axios');

// Google Generative AI initialization
const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function uploadToGemini(filePath, mimeType) {
  try {
    console.log(`Attempting to upload file: ${filePath}`);
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType,
      displayName: 'capture.png', // Fixed display name
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  } catch (error) {
    console.error("Error uploading file to Gemini: ", error);
    throw error;
  }
}

// Function to generate a random joke using a public API
async function getRandomJoke() {
  try {
    const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
    if (response.data.type === 'single') {
      return response.data.joke; // Joke is a single statement
    } else {
      return `${response.data.setup} - ${response.data.delivery}`; // Setup and delivery for two-part jokes
    }
  } catch (error) {
    console.error("Error fetching joke:", error);
    return "I couldn't think of a joke right now, but I'm here for you!";
  }
}

// Function to generate a motivational quote
async function getRandomQuote() {
  const quotes = [
    "Keep your face always toward the sunshine—and shadows will fall behind you. - Walt Whitman",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Your limitation—it's only your imagination.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Function to generate a chatbot response based on emotion and context
async function generateChatResponse(emotion, context) {
  const chatSession = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  }).startChat({
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 512,
    },
    history: [
      {
        role: "user",
        parts: [
          {
            text: `The user is feeling ${emotion}. Context: ${context}. Please generate a response acknowledging the emotion and provide comfort or support.`,
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage();
  return result.response.text();
}

// Route to handle file upload and Google Generative AI processing
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const filePath = path.join(__dirname, '../uploads/capture.png'); 
    const mimeType = req.file.mimetype;

    if (!fs.existsSync(filePath)) {
      console.error("File does not exist: " + filePath);
      return res.status(400).json({ error: 'File not found: capture.png' });
    }

    // Upload the image to Google Gemini
    const uploadedFile = await uploadToGemini(filePath, mimeType);

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              fileData: {
                mimeType: uploadedFile.mimeType,
                fileUri: uploadedFile.uri,
              },
            },
            { text: prompt || 'Please analyze the emotion in this image.' },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(prompt || 'Analyze the emotion in this image.');
    const responseText = await result.response.text(); // Get response text

    console.log("Emotion Detection Response: ", responseText); // Debug response

    // Assuming the response contains the detected emotion
    const detectedEmotion = extractEmotion(responseText); // Use a function to extract the actual emotion from the response

    // Call the generateChatResponse function to generate the chatbot response
    const chatbotResponse = await generateChatResponse(detectedEmotion, responseText);

    // Optionally include a random joke or motivational quote
    const randomJokeOrQuote = Math.random() < 0.5 ? await getRandomJoke() : await getRandomQuote();

    // Send back the combined response
    res.status(200).json({ 
      emotion: detectedEmotion, 
      message: chatbotResponse, 
      extra: randomJokeOrQuote 
    });
  } catch (error) {
    console.error('Error during AI conversation: ', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

module.exports = router;

// Utility function to extract emotion from response text
function extractEmotion(responseText) {
  // Example: Simple logic to extract the emotion from the responseText
  const emotionRegex = /(?:feeling|emotion\sis)\s(\w+)/i;
  const match = responseText.match(emotionRegex);
  return match ? match[1].toLowerCase() : "neutral"; // Default to "neutral" if no match
}
