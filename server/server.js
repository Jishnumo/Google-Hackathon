const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json({ limit: '10mb' })); // Handle large image files


app.get("/", (req, res) => {
    res.send("<h2> backend is running...</h2>");
  });
  
// Route for analyzing text prompt and returning the Gemini response
app.post('/analyze-prompt', async (req, res) => {
    const { prompt } = req.body;
    const apiKey = 'AIzaSyDqb1D_IhdyyYuFeCBlXP7aAYOiA9_P4NQ';  // Replace with your actual API key
    const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: prompt // Send the text prompt to Gemini
                    }
                ]
            }
        ]
    };

    try {
        // Send the POST request to the Gemini API using Axios
        const apiResponse = await axios.post(apiURL, requestBody, {
            headers: { 'Content-Type': 'application/json' }
        });

        // If the response from the API is successful, send the result to the client
        if (apiResponse.status === 200) {
            res.json({ generatedContent: apiResponse.data.candidates[0].text });
        } else {
            res.status(apiResponse.status).send(apiResponse.statusText);
        }
    } catch (error) {
        console.error('Error processing the prompt:', error.message);
        res.status(500).send('Error processing the prompt: ' + error.message);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
