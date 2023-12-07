// readUrlRoute.js
const express = require('express');
const router = express.Router();
const { readArticleFromUrl, translateText, setLanguage } = require('../helpers/helperFunctions');

router.post('/', async (req, res) => {
  try {
    const { urlTextarea: url, translationDirection } = req.body;
    const { src, tgt } = setLanguage(translationDirection);

    debugger;

    const { articleTitle, bilingualArray } = await readArticleFromUrl(url, src, tgt);

    if (!articleTitle) {
      console.error('Failed to retrieve article title.');
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('articleTitle:', articleTitle);
    console.log('bilingualArray:', bilingualArray);

    // Rest of the code...

    res.render('translate', { articleTitle, bilingualArray, translationDirection });
  } catch (error) {
    console.error('Error reading and translating text:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
