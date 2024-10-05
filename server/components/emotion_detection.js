const express = require("express");
const router = express.Router();
const multer = require("multer"); // Multer middleware for handling file uploads
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
const path = require("path");


const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);


const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory
});

// Helper function to upload file to Google Gemini
async function uploadToGemini(filePath, mimeType) {
  try {
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType,
      displayName: "capture.png",
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  } catch (error) {
    console.error("Error uploading file to Gemini: ", error);
    throw error;
  }
}

// Route to handle file upload and process with Google Generative AI (Gemini)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { prompt } = req.body; // Optional prompt, default to emotion detection message
    const imageBuffer = req.file.buffer; // Get the image buffer from the uploaded file
    const mimeType = req.file.mimetype; // Get the MIME type of the image

    // Define the temporary file path
    const tempFilePath = path.join(__dirname, "../uploads", "capture.png");

    // Write the image buffer to a temporary file
    fs.writeFileSync(tempFilePath, imageBuffer);

    // Upload the image file path to Google Gemini
    const uploadedFile = await uploadToGemini(tempFilePath, mimeType);

    // Configure the Gemini model for emotion detection
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };

    // Start a chat session with the Gemini model
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: uploadedFile.mimeType, // Set file MIME type
                fileUri: uploadedFile.uri, // Use file URI from upload result
              },
            },
            { text: prompt || "Please analyze the emotion in this image and return only the emotion in this format: { emotion: '<emotionValue>' }."}, // Default prompt if none is provided
          ],
        },
      ],
    });


    const result = await chatSession.sendMessage(
      prompt || "Analyze the emotion in this image."
    );
    const responseText = await result.response.text(); // Get the text response from the model

    console.log("Response from AI: ", responseText); // Log the response for debugging

   
    //!fs.unlinkSync(tempFilePath); 

    // Parse the JSON response string
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText); // Parse the string to JSON
    } catch (error) {
      console.error("Error parsing response JSON: ", error);
      return res.status(500).json({ error: "Error parsing response from AI." });
    }

    // Send the AI response back to the frontend
    res.status(200).json(jsonResponse); // Send the parsed JSON response
  } catch (error) {
    console.error("Error during AI conversation: ", error);
    // Ensure to only send one response
    if (!res.headersSent) {
      return res.status(500).json({ error: "An error occurred while processing your request." });
    }
  }
});

module.exports = router;
