const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const {
    GoogleGenerativeAI,
    GoogleAIFileManager
} = require('@google/generative-ai');

const app = express();
app.use(bodyParser.json({ limit: '10mb' })); // Handle large image files

const apiKey = process.env.GEMINI_API_KEY; // Set your Gemini API key here
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

// Upload the given file to Gemini
async function uploadToGemini(filePath, mimeType) {
    const uploadResult = await fileManager.uploadFile(filePath, {
        mimeType,
        displayName: path.basename(filePath),
    });
    console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.name}`);
    return uploadResult.file;
}

// Handle file uploads and interactions with the Gemini API
app.post('/process-image', async (req, res) => {
    const { image } = req.body;

    try {
        // Step 1: Save the image locally (Base64 -> File)
        const base64Data = image.replace(/^data:image\/png;base64,/, ""); // Remove the Base64 header
        const imagePath = path.join(__dirname, 'uploaded_image.png'); // Save the image locally
        fs.writeFileSync(imagePath, base64Data, 'base64');

        // Step 2: Upload the image to Gemini
        const uploadedFile = await uploadToGemini(imagePath, 'image/png');

        // Step 3: Start a chat session with the Gemini model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: 'text/plain',
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
                    ],
                },
            ],
        });

        // Step 4: Send the request to the Gemini API
        const result = await chatSession.sendMessage("Identify the emotion in this image");
        const generatedText = result.response.text();

        // Step 5: Send the result back to the frontend
        res.json({ generatedContent: generatedText });

    } catch (error) {
        console.error('Error processing the image or generating content:', error);
        res.status(500).send('Error processing the image or generating content.');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
