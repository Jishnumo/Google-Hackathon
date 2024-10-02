const express = require('express');
const bodyParser = require('body-parser');
const readline = require('readline'); // For reading user input from the terminal
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Load the Gemini API key from environment variables
const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Store the history of the conversation for continuous context
let chatHistory = [];

// Function to generate response from Gemini based on the user's input
async function generateChatResponse(userMessage) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Configuration for the model's generation
    const generationConfig = {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1000,
    };

    // Add the user's message to the chat history
    chatHistory.push({
        role: 'user',
        parts: [{ text: userMessage }],
    });

    // Start the chat session with the accumulated history
    const chatSession = model.startChat({
        generationConfig,
        history: chatHistory, // Send the chat history for continuous context
    });

    // Send the user's message to the model
    const result = await chatSession.sendMessage(userMessage);
    const responseText = result.response.text();

    // Add the response to the chat history
    chatHistory.push({
        role: 'model',
        parts: [{ text: responseText }],
    });

    return responseText;
}

// Function to handle continuous user input and provide response from Gemini
function handleChat() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Please enter your emotion (e.g., happy, sad, anxious): ', async (emotion) => {
        if (!emotion) {
            console.log('Emotion is required.');
            rl.close();
            return;
        }

        try {
            // Generate response based on initial emotion
            const response = await generateChatResponse(emotion);
            console.log(`Response from Gemini: ${response}`);

            // Now, enter continuous chat mode
            continueChat(rl);
        } catch (error) {
            console.error('Error generating response:', error);
            rl.close();
        }
    });
}

// Function to keep asking the user for input and respond based on Gemini's feedback
function continueChat(rl) {
    rl.question('You can continue chatting, or type "exit" to stop: ', async (message) => {
        if (message.toLowerCase() === 'exit') {
            console.log('Goodbye!');
            rl.close();
            return;
        }

        try {
            // Generate response for the continuous chat
            const response = await generateChatResponse(message);
            console.log(`Response from Gemini: ${response}`);

            // Continue the chat loop
            continueChat(rl);
        } catch (error) {
            console.error('Error generating response:', error);
            rl.close();
        }
    });
}

// Start the Express server
app.listen(port, () => {
    console.log(`Chatbot backend listening at http://localhost:${port}`);
    handleChat(); // Start asking for emotion input once the server starts
});
