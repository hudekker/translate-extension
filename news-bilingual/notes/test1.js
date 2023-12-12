// Select all span elements with the attribute jsaction
var spansWithJsAction = [...document.querySelectorAll('span[jsaction] > span')].filter(el => el.innerHtml != '');

// Create an array to store the extracted text
var textArray = [];

// Loop through each span element with jsaction
spansWithJsAction.forEach(function (spanElement) {
  // Get all lower-level elements under the current span
  var lowerLevelElements = spanElement.querySelectorAll('*');

  // Extract text content from each lower-level element
  lowerLevelElements.forEach(function (lowerLevelElement) {
    // Check if the lower-level element has text content
    if (lowerLevelElement.textContent.trim() !== '') {
      // Add the text content to the array
      textArray.push(lowerLevelElement.textContent.trim());
    }
  });
});

// Now, textArray contains the extracted text from all lower-level elements under spans with jsaction
console.log(textArray);
