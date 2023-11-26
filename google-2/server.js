const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    console.log(text);
    console.log(targetLanguage);
    const apiKeyFilePath = '/Users/hudekker/hudekker/stuff.txt'; // Replace with the actual path to your API key file
    const apiKey = readApiKeyFromFile(apiKeyFilePath);

    const translatedText = await translateText(text, targetLanguage, apiKey);
    res.json({ translatedText });
  } catch (error) {
    console.error('Error processing translation request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function translateText(text, targetLanguage, apiKey) {
  const apiUrl = 'https://translation.googleapis.com/language/translate/v2';

  const params = {
    q: text,
    target: targetLanguage,
    key: apiKey,
  };

  return axios.post(apiUrl, null, { params })
    .then(response => {
      const translatedText = response.data.data.translations[0].translatedText;
      return translatedText;
    })
    .catch(error => {
      console.error('Error translating text:', error.message);
      throw error;
    });
}

function readApiKeyFromFile(filePath) {
  try {
    const apiKey = fs.readFileSync(filePath, 'utf-8').trim();
    return apiKey;
  } catch (error) {
    console.error('Error reading API key from file:', error.message);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Translation server is running at http://localhost:${port}/translate`);
});
