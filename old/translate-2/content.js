chrome.runtime.onMessage.addListener(async ({ action, data }, sender, sendResponse) => {
  switch (action) {
    case "selectParagraphs":
      const selection = window.getSelection();
      const selectedElement = selection.anchorNode.parentElement;

      // Do something with the selected element
      console.log("selectedElement");
      console.log(selectedElement);

      // Check if the element is a paragraph
      if (selectedElement && selectedElement.tagName === "P") {
        // Get all peer-level p elements
        const allPElements = Array.from(selectedElement.parentNode.children).filter((el) => el.tagName === "P");

        // Filter out p elements with empty innerText
        const nonEmptyPElements = allPElements.filter((el) => el.innerText.trim() !== "");

        // Create an array with each item being an object containing the p element and its innerText
        const resultArray = nonEmptyPElements.map((el) => ({ element: el, innerText: el.innerText }));

        const textArray = resultArray.map((el) => el.innerText);

        // Print the result
        console.log(textArray);
        // Trigger the navigation and pasting when needed
        chrome.runtime.sendMessage({ action: "navigateAndPaste", data: textArray });
      }
      break;

    case "pasteData":
      console.log("inside content pasteData");

      if (Array.isArray(data)) {
        console.log(data);

        // call the google translate API here
      }
      break;

    case "pasteData2":
      const apiKey = "YOUR_GOOGLE_TRANSLATE_API_KEY";
      const targetLanguage = "fr"; // Replace with your target language code

      const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
      const textToTranslate = data.join("\n");

      try {
        // Make API call
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: textToTranslate,
            target: targetLanguage,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Translation:", result.data.translations[0].translatedText);
          // Handle the translated text as needed
        } else {
          throw new Error(`Translation Error: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error(error.message);
      }
      break;

    default:
      // Handle unknown actions, if necessary
      break;
  }
});
