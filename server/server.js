const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

app.post('/generate-story', upload.single('image'), async (req, res) => {
    const storyPrompt = req.body.prompt;
    const imagePath = req.file ? req.file.path : null;

    try {
        // Генерація казки
        const storyResponse = await axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003',
            prompt: storyPrompt,
            max_tokens: 500
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const story = storyResponse.data.choices[0].text.trim();

        // Генерація зображення
        const imageBase64 = imagePath ? fs.readFileSync(imagePath, 'base64') : null;

        const imageData = {
            prompt: storyPrompt,
            n: 1,
            size: "1024x1024"
        };

        if (imageBase64) {
            imageData.input_image = imageBase64;
        }

        const imageResponse = await axios.post('https://api.openai.com/v1/images/generations', imageData, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (imagePath) {
            fs.unlinkSync(imagePath);
        }

        const imageUrl = imageResponse.data.data[0].url;

        res.json({ title: storyPrompt, story, imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate story or image' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
