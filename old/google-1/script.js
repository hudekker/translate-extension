const axios = require('axios');

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

// Example usage
// const textToTranslate = "Hello, how are you?";
const textToTranslate = `
<p>Altman is returning as chief executive officer and the initial board will be led by Bret Taylor, a former co-CEO of Salesforce Inc. The other directors are Larry Summers, the former US Treasury Secretary, and existing member Adam D’Angelo, the co-founder and CEO of Quora Inc. OpenAI is now working “to figure out the details,” the company said in a post on X, formerly Twitter.</p>

<p>The decision to restore him to the world’s best-known AI startup marks a significant victory for Microsoft Corp., which worked with fellow investors to reverse Altman’s firing. CEO Satya Nadella publicly supported Altman throughout the turmoil and briefly agreed to hire him at Microsoft to start a new in-house research group.</p>

<p>The two new board members also hold appeal for Wall Street and the Silicon Valley crowd. Summers, a Harvard academic and paid contributor to Bloomberg Television, sits on the board of several startups, including Jack Dorsey’s Block Inc. Taylor is a director at Shopify Inc. and, as a director at Twitter, acted as a calming force during the sale to Elon Musk last year.</p>
`

const targetLanguage = "zh-TW"; // Replace with the language code for your desired language
const fs = require('fs');

// Function to read API key from a text file
function readApiKeyFromFile(filePath) {
  try {
    const apiKey = fs.readFileSync(filePath, 'utf-8').trim();
    return apiKey;
  } catch (error) {
    console.error('Error reading API key from file:', error.message);
    throw error;
  }
}

// Example usage
const apiKeyFilePath = '/Users/hudekker/hudekker/stuff.txt'; // Replace with the actual path to your API key file
const apiKey = readApiKeyFromFile(apiKeyFilePath);

// console.log(`API Key read from file: ${apiKey}`);

// Now you can use the apiKey variable in your API requests


translateText(textToTranslate, targetLanguage, apiKey)
  .then(translatedText => {
    console.log(`Original text: ${textToTranslate}`);
    console.log(`Translated text: ${translatedText}`);

    debugger;
  });
