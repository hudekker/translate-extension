// const keyFile = require('/Users/hudekker/hudekker/json-stuff/test1-279603-94eeb6426c7b.json'); // Replace with your service account key file
// const keyFile = require('/Users/hudekker/hudekker/json-stuff/test1-279603-c1acdaabc170.json'); // Replace with your service account key file

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const { Translate } = require('@google-cloud/translate');
const { Translate } = require('@google-cloud/translate').v2;

const originalPayload = {
  "text": "Hello, how are you?",
  "sourceLanguage": "en",
  "targetLanguage": "zh-TW"
};
// Encode the JSON object as a query parameter
const encodedPayload = encodeURIComponent(JSON.stringify(originalPayload));
const apiUrl = `http://localhost:3000/translate?payload=${encodedPayload}`;

// Set up the Google Cloud Translation API client
const translate = new Translate({ projectId: 'Test1' });

app.use(bodyParser.json());

// Translation endpoint
app.get('/translate', async (req, res) => {
  try {
    let { text, sourceLanguage, targetLanguage } = req.body;

    // Set default values if input JSON is empty
    text = text || "what is going on here my man?";
    sourceLanguage = sourceLanguage || "en";
    targetLanguage = targetLanguage || "zh-TW";

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

