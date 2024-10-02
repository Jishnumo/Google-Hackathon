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

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 512,
  responseMimeType: "text/plain",
};

// Upload image to Gemini
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

// Generate a chatbot response based on the emotion detected
async function generateChatResponse(emotion, context) {
  const chatSession = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
  }).startChat({
    generationConfig,
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

// Route to handle file upload, emotion detection, and chatbot response
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const filePath = path.join(__dirname, '../uploads/capture.png'); 
    const mimeType = req.file.mimetype;

    if (!fs.existsSync(filePath)) {
      console.error("File does not exist: " + filePath);
      return res.status(400).json({ error: 'File not found: capture.png' });
    }

    // Upload the image to Gemini for emotion detection
    const uploadedFile = await uploadToGemini(filePath, mimeType);

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

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

    // Get emotion detection response from Gemini
    const result = await chatSession.sendMessage(prompt || 'Analyze the emotion in this image.');
    const emotionResponse = await result.response.text(); // Extract emotion response text

    console.log("Emotion Detection Response: ", emotionResponse); // Debug response

    // Assuming the response contains the detected emotion
    const detectedEmotion = 'happy'; // Replace this with the actual emotion extracted

    // Generate chatbot response based on detected emotion
    const chatbotResponse = await generateChatResponse(detectedEmotion, emotionResponse);

    // Send back the chatbot response to the frontend
    res.status(200).json({
      emotion: detectedEmotion,
      message: chatbotResponse,
    });
  } catch (error) {
    console.error('Error during AI conversation: ', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

module.exports = router;
