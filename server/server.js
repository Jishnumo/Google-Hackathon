const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json({ limit: '10mb' })); // Handle large image files

app.post('/analyze-emotion', async (req, res) => {
    const { image } = req.body;
    const apiKey = 'YOUR_GOOGLE_API_KEY';  // Keep your API key secure
    const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const requestBody = {
        requests: [
            {
                image: {
                    content: image // Send base64 image content
                },
                features: [
                    {
                        type: 'FACE_DETECTION',
                        maxResults: 1
                    }
                ]
            }
        ]
    };

    try {
        const apiResponse = await fetch(apiURL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' }
        });

        if (apiResponse.ok) {
            const result = await apiResponse.json();
            res.json(result);
        } else {
            res.status(apiResponse.status).send(apiResponse.statusText);
        }
    } catch (error) {
        res.status(500).send('Error processing the image: ' + error.message);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
