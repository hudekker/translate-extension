const express = require('express');
const router = express.Router();
const axios = require('axios'); // Import axios for making HTTP requests
const fs = require('fs');

// Import your helper functions
const { readArticleFromUrl, translateText } = require('../helpers/helperFunctions');

router.post('/', async (req, res) => {
  try {
    const { url, targetLanguage } = req.body;
    const articleText = await readArticleFromUrl(url);
    const translations = await translateText(articleText, targetLanguage);

    res.json({ translations });
  } catch (error) {
    console.error('Error reading and translating text:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
