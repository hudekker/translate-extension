const BASE_URL = 'http://localhost:3000';

const readUrl = async (url) => {
  try {
    const response = await fetch(`${BASE_URL}/read-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.articleText;
    } else {
      console.error('Error reading article:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error reading article:', error.message);
    return null;
  }
};

const translateText = async (articleText) => {
  try {
    const response = await fetch(`${BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: articleText, targetLanguage: 'en' }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.translatedText;
    } else {
      console.error('Error translating text:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error translating text:', error.message);
    return null;
  }
};

document.addEventListener('DOMContentLoaded', async function () {
  const urlInput = document.getElementById('urlInput');
  const btnReadUrl = document.getElementById('btn-read-url');
  const resultsContainer = document.getElementById('results');

  btnReadUrl.addEventListener('click', async () => {
    const url = urlInput.value;

    // Get the article text
    const articleText = await readUrl(url);
    console.log(articleText);

    if (articleText !== null) {
      // Make a POST request to the /translate endpoint
      const translatedText = await translateText(articleText);

      if (translatedText !== null) {
        // Update your frontend with the scraped and translated data
        resultsContainer.innerHTML = `<h3>${translatedText}</h3>`;
      }
    }
  });
});
