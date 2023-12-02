const PROXY_PORT = 3500;
const GOOGLE_PORT = 3000;

// Function to scrape the webpage and display results
async function scrapeAndDisplay() {
  // Get the URL input value
  const urlInput = document.getElementById('urlInput');
  const url = urlInput.value;

  // Get the results container
  const resultsContainer = document.getElementById('results');

  // Display a message if the URL is empty
  if (!url) {
    resultsContainer.innerHTML = '<p class="error-message">Please enter a valid URL.</p>';
    return;
  }

  try {
    // Fetch the content from the specified URL
    const url2 = `http://localhost:${PROXY_PORT}/proxy/${encodeURIComponent(url)}`

    // const response = await fetch(
    //   `http://localhost:3000/proxy/${encodeURIComponent(url)}`);


    const response = await fetch(
      `http://localhost:${PROXY_PORT}/proxy/${encodeURIComponent(url)}`,
      {
        headers: {
          'Authorization': 'yu-guang-dao',
          'Custom-header': 'hello there'
        },
      });

    // Check if the request was successful (status code 200)
    if (response.ok) {

      // Parse the HTML content
      const textContent = await response.text();

      debugger;

      // Assuming the 'textContent' variable contains the HTML response
      const parser = new DOMParser();
      const doc = parser.parseFromString(textContent, 'text/html');

      // Now you can use querySelector on the 'doc' object
      const article = doc.querySelector('article');

      // Check if the 'article' element is found
      // if (articleElement) {
      //   // Do something with the 'article' element
      //   console.log(articleElement.innerHTML);
      // } else {
      //   console.log('No <article> element found in the HTML response.');
      // }

      // Create a temporary div to parse the HTML
      // const tempDiv = document.createElement('div');
      // tempDiv.innerHTML = textContent;

      // // Find the article tag
      // const article = tempDiv.querySelector('article');

      // Check if the article tag is found
      if (article) {
        // Extract the title (h1 tag) from the article
        const title = article.querySelector('h1');

        // Extract text from all p tags within the article, excluding those with only an anchor tag
        const paragraphs = Array.from(article.querySelectorAll('p')).filter(paragraph => {
          const hasOnlyAnchor = paragraph.children.length === 1 && paragraph.children[0].tagName === 'A';
          return !hasOnlyAnchor;
        }).filter(el => el.innerText != '');

        // Compile paragraphs into a text document with line spaces
        // const compiledText = paragraphs.map(paragraph => paragraph.textContent).join('\n\n');
        // Compile paragraphs into a text document with line breaks

        // const compiledText = paragraphs.map(paragraph => paragraph.outerHTML).join('\n\n');

        let compiledText = [];

        for (let i = 0; i < paragraphs.length; i++) {
          const apiUrl = `http://localhost:${GOOGLE_PORT}/translate`
          const element = paragraphs[i];
          const data = {
            text: element.innerText,
            targetLanguage: 'zh-TW',
          };

          try {

            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            const responseData = await response.json();

            compiledText.push(responseData.translatedText)
            compiledText.push(response.data.translatedText)

          } catch (error) {
            console.error('Error translating text:', error.message);
            throw error;
          }
        }


        compiledText = compiledText.join('\n\n');

        // Display the title and compiled text on the page
        resultsContainer.innerHTML = `
          <h2 class="result-title">${title ? title.textContent : 'Title not found'}</h2>
          <p class="result-text">${compiledText}</p>
        `;
      } else {
        resultsContainer.innerHTML = '<p class="error-message">Article tag not found on the page.</p>';
      }
    } else {
      resultsContainer.innerHTML = `<p class="error-message">Error: ${response.status}</p>`;
    }
  } catch (error) {
    resultsContainer.innerHTML = '<p class="error-message">An error occurred during the fetch operation.</p>';
    console.error(error);
  }
}

// Function to copy results to clipboard
function copyToClipboard() {
  // Get the results container
  const resultsContainer = document.getElementById('results');

  // Create a range to select the text
  const range = document.createRange();
  range.selectNode(resultsContainer);

  // Copy the selected text to the clipboard
  navigator.clipboard.writeText(range.toString())
    .then(() => {
      // Update the button text
      const copyButton = document.getElementById('copyButton');
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = 'Copy';
      }, 2000); // Reset the button text after 2 seconds
    })
    .catch((error) => {
      console.error('Unable to copy text to clipboard:', error);
    });
}

