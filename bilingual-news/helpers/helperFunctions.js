// helperFunctions.js
const axios = require('axios');
const { JSDOM } = require('jsdom');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const apiKey = process.env.TRANSLATE_API;
let language = {};

const setLanguage = (translationDirection) => {
  let src = 'en';
  let tgt = 'zh-TW';

  switch (translationDirection) {
    case 'chineseToEnglish':
      src = 'zh-TW';
      tgt = 'en';
      break;
    case 'englishToChinese':
      // Default values are already set
      break;
    // Add more cases if needed

    default:
      // Handle unexpected values if necessary
      break;
  }

  return { src, tgt };
};

const readArticleFromUrl = async (url, tgt) => {
  try {
    const response = await axios.get(url);
    const bilingualArray = [];
    let articleTitle = {};

    if (tgt == 'en') {
      language.original = 'chinese';
      language.target = 'english';
    } else {
      language.original = 'english';
      language.target = 'chinese';
    }

    if (response.status !== 200) {
      console.error('Problem with HTTP request or processing');
      return;
    }

    const dom = new JSDOM(response.data);
    const article = dom.window.document.querySelector('article');

    if (!article) {
      console.error('Article element not found.');
      return;
    }

    const originalTitle = article.querySelector('h1').textContent;
    const translatedTitle = await translateText(originalTitle, tgt);
    articleTitle = { [language.original]: originalTitle, [language.target]: translatedTitle };

    const paragraphs = Array.from(article.querySelectorAll('p')).filter(paragraph => {
      const hasText = paragraph.textContent.trim().length > 0;
      const hasOnlyAnchor = paragraph.children.length === 1 && paragraph.children[0].tagName === 'A';
      return hasText || !hasOnlyAnchor;
    }).filter(el => el.innerText != '');

    const paragraphsText = paragraphs.map(el => el.textContent);

    for (let i = 0; i < paragraphsText.length; i++) {
      const originalText = paragraphsText[i];
      const translatedText = await translateText(originalText, tgt);
      bilingualArray.push({ [language.original]: originalText, [language.target]: translatedText });
    }

    return { articleTitle, bilingualArray };
  } catch (error) {
    console.error('Error reading text from URL:', error.message);
    throw error;
  }
};

const translateText = async (text, tgt) => {
  try {
    const apiUrl = 'https://translation.googleapis.com/language/translate/v2';
    const params = {
      q: text,
      target: tgt,
      key: apiKey,
    };

    const response = await axios.post(apiUrl, null, { params });
    const translatedText = response.data.data.translations[0].translatedText;

    console.log(translatedText);

    return translatedText;
  } catch (error) {
    console.error('Error translating text:', error.message);
    throw error;
  }
};

module.exports = {
  setLanguage,
  readArticleFromUrl,
  translateText,
};
