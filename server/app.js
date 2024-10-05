const express = require('express');
const cors = require('cors');
require('dotenv').config();

//! Api Routes
const emotion_detection = require("./components/emotion_detection")
const chatbot = require("./components/chatbot"); 


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h2>Healios.ai Backend is running </h2>');
});

app.use("/api/emotion-check" , emotion_detection)
app.use("/api/chatbot", chatbot);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
