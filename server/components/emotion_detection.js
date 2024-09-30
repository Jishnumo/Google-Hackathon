const express = require('express');
const router = express.Router();
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const fs = require('fs');
const upload = require('./upload'); // Multer middleware for file handling

// Google Generative AI initialization
const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);


async function uploadToGemini(filePath, mimeType) {
  try {
    console.log(`Attempting to upload file: ${filePath}`); // Log file path
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

//! Route to handle file upload and Google Generative AI processing
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const filePath = path.join(__dirname, '../uploads/capture.png'); 
    const mimeType = req.file.mimetype;

    // Check if the file exists before processing
    if (!fs.existsSync(filePath)) {
      console.error("File does not exist: " + filePath);
      return res.status(400).json({ error: 'File not found: capture.png' });
    }

    console.log("File path: ", filePath); // Debug file path

    // Upload the image to Google Gemini
    const uploadedFile = await uploadToGemini(filePath, mimeType);

    // Google Generative AI model configuration
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

    // Set up the conversation history with the file's URI and MIME type
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              fileData: {
                mimeType: uploadedFile.mimeType, // Use the uploaded file's MIME type
                fileUri: uploadedFile.uri, // Use the uploaded file's URI
              },
            },
            { text: prompt || 'Please analyze the emotion in this image.' },
          ],
        },
      ],
    });

    // Send message to AI model and get response
    const result = await chatSession.sendMessage(prompt || 'Analyze the emotion in this image.');
    const responseText = result.response.text();
    console.log("Response: ",  result.response); // Debug response

    // Send back the result
    res.status(200).json({ message: responseText });
  } catch (error) {
    console.error('Error during AI conversation: ', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

module.exports = router;
