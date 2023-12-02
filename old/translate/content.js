chrome.runtime.onMessage.addListener(({ action, data }, sender, sendResponse) => {
  switch (action) {
    case "selectParagraphs":
      const selection = window.getSelection();
      const selectedElement = selection.anchorNode.parentElement;

      // Do something with the selected element
      console.log('selectedElement');
      console.log(selectedElement);

      // Check if the element is a paragraph
      if (selectedElement && selectedElement.tagName === 'P') {
        // Get all peer level p elements
        const allPElements = Array.from(selectedElement.parentNode.children).filter(el => el.tagName === 'P');

        // Filter out p elements with empty innerText
        const nonEmptyPElements = allPElements.filter(el => el.innerText.trim() !== '');

        // Create an array with each item being an object containing the p element and its innerText
        const resultArray = nonEmptyPElements.map(el => ({ element: el, innerText: el.innerText }));

        const textArray = resultArray.map(el => el.innerText);

        // Print the result
        console.log(textArray);
        // Trigger the navigation and pasting when needed
        chrome.runtime.sendMessage({ action: "navigateAndPaste", data: textArray });
      }
      break;

    case "pasteData":
      console.log('inside content pasteData');

      if (Array.isArray(data)) {

        console.log(data);

        // Prefix the entire array with the statement
        // const prefixedText = `please list the original chinese paragraphs immediately followed by its english equivalent,\n` +
        //   `then continue with the second chinese paragraph followed by its english equivalent, and so on \n` +
        //   `for the entire document.  please give line spacing between every paragraph including the line \n` +
        //   `spacing between the chinese and english paragraphs.  I do not want paragraph numbering.` + data.join('\n');

        const prefixedText = `please interleave translate: ` + data.join('\n');

        // Paste the array into the textarea
        const textarea = document.getElementById('prompt-textarea');



        if (textarea) {
          textarea.value = prefixedText;  // Assuming you want to join array elements with newline
        }

        // Assuming you have a textarea element with the id "myTextarea"
        // var textarea = document.getElementById("myTextarea");

        // Create a new "Enter" key event
        // var enterKeyEvent = new KeyboardEvent("keydown", {
        //   key: "Enter",
        //   code: "Enter",
        //   keyCode: 13,
        //   which: 13,
        //   // You may need to adjust these properties based on your specific requirements
        // });

        // // Dispatch the "Enter" key event to the textarea
        // textarea.dispatchEvent(enterKeyEvent);


        // // Click the button to send the data
        // const sendButton = document.querySelector('[data-testid="send-button"]');
        // if (sendButton) {
        //   sendButton.click();
        // }
      }
      break;

    default:
      // Handle unknown actions, if necessary
      break;
  }
});
