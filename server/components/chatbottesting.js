/*
 * Install the Generative AI SDK
 * $ npm install @google/generative-ai
 * $ npm install axios
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
require("dotenv").config(); // Load environment variables from .env file

const apiKey = "AIzaSyCP5M0PmBKsOKwyTmSoy94zHgJ58lAxaj0"; // Use environment variable for API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

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

// Function to generate a motivational quote using an API (simulated here)
async function getRandomQuote() {
  // Here you can integrate an actual quote API
  const quotes = [
    "Keep your face always toward the sunshine—and shadows will fall behind you. - Walt Whitman",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Your limitation—it's only your imagination.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Function to generate response from the chatbot based on the user's emotion
async function generateChatResponse(emotion, context, memory) {
  const chatSession = model.startChat({
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
            text: `You are a mental well-being chatbot. When a user inputs their emotion (e.g., happy, sad, anxious), respond empathetically based on that emotion. Your responses should: 
            1. **Show Understanding**: Acknowledge the user's feelings. 
            2. **Encourage Sharing**: Ask follow-up questions to invite the user to elaborate. 
            3. **Be Light-Hearted**: Incorporate relevant jokes or uplifting comments when appropriate. 
            4. **Provide Support**: Offer comforting advice or motivational quotes. 
            5. **Be Human-like**: Ensure your tone is warm and relatable. 
            6. **Contextual Memory**: Remember previous user interactions to personalize responses. 
            7. **Identify Serious Concerns**: If the user expresses thoughts of self-harm or suicide, gently encourage them to seek professional help and validate their feelings. 
            User emotion: "${emotion}". Context: "${context}". Previous interactions: ${memory}.`,
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(`User is feeling: ${emotion}`);
  return result.response.text();
}

// Main function to handle continuous user input and generate responses
async function main() {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const memory = []; // Store previous interactions

  const askEmotion = () => {
    readline.question("Please enter your emotion (e.g., happy, sad, anxious) or type 'exit' to quit: ", async (emotion) => {
      if (emotion.toLowerCase() === 'exit') {
        console.log('Goodbye! Remember, you are not alone. Take care!');
        readline.close();
        return;
      }

      // Additional context input
      readline.question("Would you like to share more context about how you're feeling? (optional): ", async (context) => {
        if (!context) {
          context = "No additional context provided.";
        } else {
          memory.push(context); // Save context in memory
        }

        // Check for sensitive content
        if (emotion.toLowerCase().includes("suicidal") || context.toLowerCase().includes("suicidal")) {
          console.log("It sounds like you might be going through a really tough time. It's very important to talk to someone who can help, like a mental health professional. You deserve support.");
          askEmotion(); // Prompt again
          return;
        }

        try {
          const response = await generateChatResponse(emotion, context, memory);
          
          // Include a joke or quote if appropriate
          const randomJokeOrQuote = Math.random() < 0.5 ? await getRandomJoke() : await getRandomQuote();
          
          console.log(`Response from Chatbot: ${response}`);
          console.log(`Just a little something to lighten the mood: ${randomJokeOrQuote}`);
        } catch (error) {
          console.error("Error generating response:", error);
        }

        // After responding, ask for the next input
        askEmotion();
      });
    });
  };

  askEmotion(); // Start the first question
}

// Run the main function
main();
