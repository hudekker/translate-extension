const express = require('express');
const axios = require('axios');
const fs = require('fs');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'GET request received for translation endpoint.' });
});

router.post('/', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    const apiKeyFilePath = '/Users/hudekker/hudekker/stuff.txt';
    const apiKey = readApiKeyFromFile(apiKeyFilePath);

    const translatedText = await translateText(text, targetLanguage, apiKey);
    res.json({ translatedText });

    // write it to my front end using ejs???
    // Render the 'translated' view and pass the translated text as a variable
    res.render('translated', { translatedText });


  } catch (error) {
    console.error('Error processing translation request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const translateText = (text, targetLanguage, apiKey) => {
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
};

const readApiKeyFromFile = (filePath) => {
  try {
    const apiKey = fs.readFileSync(filePath, 'utf-8').trim();
    return apiKey;
  } catch (error) {
    console.error('Error reading API key from file:', error.message);
    throw error;
  }
};

module.exports = router;
