const readApiKeyFromFile = (filePath) => {
  try {
    const apiKey = fs.readFileSync(filePath, 'utf-8').trim();
    return apiKey;
  } catch (error) {
    console.error('Error reading API key from file:', error.message);
    throw error;
  }
};

const readArticleFromUrl = async (url) => {
  try {
    const response = await axios.get(url);
    // Extract and return the text from the response (modify based on the actual structure of the article)
    return response.data;
  } catch (error) {
    console.error('Error reading text from URL:', error.message);
    throw error;
  }
};

const translateText = async (text, targetLanguage) => {
  try {
    // Need to loop on paragraphs to do bilingual translation
    const translateApiUrl = 'https://translation.googleapis.com/language/translate/v2';
    const apiKeyFilePath = '/Users/hudekker/hudekker/stuff.txt';
    const apiKey = readApiKeyFromFile(apiKeyFilePath);

    const response = await axios.post(translateApiUrl, {
      q: text,
      target: targetLanguage,
      key: apiKey,
    });

    const translatedText = response.data.data.translations[0].translatedText;
    return translatedText;
  } catch (error) {
    console.error('Error translating text:', error.message);
    throw error;
  }
};
