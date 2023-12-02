// Authentication, on terminal do this:
// gcloud auth application-default login

//For quota there are 2 options, only need to do 1 of them:
// 1) in the terminal, execute this replacing with your quota project id
// export GOOGLE_CLOUD_PROJECT=your-quota-project-id

// 2) On nodejs, you can set the quota project in the .env
// GOOGLE_CLOUD_PROJECT=your-quota-project-id node your-app.js


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Translate } = require('@google-cloud/translate').v2;

const originalPayload = {
  "text": "Hello, how are you?",
  "sourceLanguage": "en",
  "targetLanguage": "zh-TW"
};

// Encode the JSON object as a query parameter
const encodedPayload = encodeURIComponent(JSON.stringify(originalPayload));

// Set up the Google Cloud Translation API client
const translate = new Translate({ projectId: 'Test1' });

app.use(bodyParser.json());

// Translation endpoint
app.post('/translate', async (req, res) => {
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

