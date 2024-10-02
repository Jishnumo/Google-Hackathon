const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('./upload'); // Multer middleware for file handling
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');

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

    console.log("Response: ", responseText); // Debug response

    res.status(200).json({ message: responseText });
  } catch (error) {
    console.error('Error during AI conversation: ', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

module.exports = router;
