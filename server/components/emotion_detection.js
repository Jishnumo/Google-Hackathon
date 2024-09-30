const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const upload = require('./upload'); // Multer middleware

// Google Generative AI initialization
const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Route to handle file upload and Google Generative AI processing
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const filePath = req.file.path; // Get the local file path saved by multer

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

    // Simulating how to upload to AI - change this as per actual implementation
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              fileData: {
                mimeType: req.file.mimetype, // Using the file's MIME type
                fileUri: filePath,           // File path from multer
              },
            },
            { text: prompt || 'Analyze this image' }, // Pass prompt if available
          ],
        },
      ],
    });

    // Send message to AI model and get response
    const result = await chatSession.sendMessage(prompt || 'Analyze image content');
    const responseText = result.response.text();

    // Send back the result
    res.status(200).json({ message: responseText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

module.exports = router;
