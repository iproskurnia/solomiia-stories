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

app.post('/generate-image', upload.single('image'), async (req, res) => {
    const prompt = req.body.prompt;
    const imagePath = req.file ? req.file.path : null;

    try {
        const imageBase64 = imagePath ? fs.readFileSync(imagePath, 'base64') : null;

        const response = await axios.post('https://api.openai.com/v1/images/generations', {
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            input_image: imageBase64 // Assuming the API can handle base64 image input directly
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (imagePath) {
            fs.unlinkSync(imagePath);
        }

        const imageUrl = response.data.data[0].url;
        res.json({ imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
