// script.js
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Listen for the custom event
document.addEventListener("extensionDataReady", async (event) => {
  console.log("inside event extensionDataReady");
  const extensionData = event.detail;

  // await sleep(10000);
  // debugger;

  if (extensionData) {
    const { origArray, transArray, lang1, lang2 } = extensionData;
    // const origArray = extensionData.origArray;
    // const transArray = extensionData.transArray;

    // Assuming you have a div with id "results-container" in your HTML
    const resultsContainer = document.getElementById("results-container");

    origArray.forEach((origItem, index) => {
      // span
      // let mySpan = `<span class="no-display" data-to-be-deleted data-index="${index}"><i class="fas fa-minus-circle fa-1x" onclick="toggleStrikethrough('${index}')"></i></span>`;
      let mySpan = document.createElement("span");
      mySpan.classList.add("no-display");
      mySpan.setAttribute("data-to-be-deleted", "");
      mySpan.setAttribute("data-index", index);

      let iconElement = document.createElement("i");
      iconElement.classList.add("fas", "fa-minus-circle", "fa-1x");
      iconElement.setAttribute("onclick", `toggleStrikethrough('${index}')`);

      mySpan.appendChild(iconElement);

      // Create a paragraph element for the original text
      const origParagraph = document.createElement("p");
      origParagraph.classList.add("p", "lang1", lang1);
      origParagraph.innerText = origItem;
      origParagraph.insertBefore(mySpan.cloneNode(true), origParagraph.firstChild);

      // Create a paragraph element for the translated text
      const transItem = transArray[index];
      const transParagraph = document.createElement("p");
      transParagraph.classList.add("p", "lang2", lang2);
      transParagraph.innerText = transItem;
      transParagraph.insertBefore(mySpan.cloneNode(true), transParagraph.firstChild);

      // Append the paragraphs to the results container
      resultsContainer.appendChild(origParagraph);
      resultsContainer.appendChild(transParagraph);
    });

    loadSavedValues();
  }
});
