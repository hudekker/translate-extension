const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config(); // Load environment variables from .env file

// Set up the Google Cloud Translation API client with API key from environment variable
const translate = new Translate({ key: process.env.GOOGLE_CLOUD_API_KEY });
app.use(cors());

app.use(bodyParser.json());

// Translation endpoint
app.post('/translate', async (req, res) => {
  try {
    let { text, sourceLanguage, targetLanguage } = req.body;

    const [translation] = await translate.translate(text, {
      from: sourceLanguage,
      to: targetLanguage
    });
    res.status(200).json({ translation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
