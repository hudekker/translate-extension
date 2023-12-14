console.log("Content script loaded!");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);

  switch (request.action) {
    case "readText":
      readTextContent(sendResponse);
      break;
    case "displayPairedParagraphs":
      console.log("inside displayPairedParagraphs");
      displayPairedParagraphs(request.origArray, request.transArray);
      break;
    case "displayData":
      console.log("inside displayData");
      const { origArray, transArray, lang1, lang2 } = request;

      console.log(origArray);
      console.log(transArray);
      console.log(lang1);
      console.log(lang2);

      const dataReadyEvent = new CustomEvent("extensionDataReady", {
        detail: { origArray, transArray, lang1, lang2 },
      });

      document.dispatchEvent(dataReadyEvent);

      // chrome.scripting.executeScript({
      //   target: { allFrames: true },
      //   function: (origArray, transArray) => {
      //     window.myExtensionData = { origArray, transArray };
      //   },
      //   args: [origArray, transArray],
      // });
      // Handle displayData action here
      break;
    default:
    // Handle default case here if needed
  }
});

const readTextContent = (sendResponse) => {
  // Get the language from (lang1) and to (lang2)
  const lang1 = document.querySelectorAll('button[data-language-code][aria-selected="true"]')[0].dataset.languageCode;

  console.log(`lang1= ${lang1}`);

  const lang2 = document.querySelectorAll('button[data-language-code][aria-selected="true"]')[1].dataset.languageCode;

  console.log(`lang2= ${lang2}`);

  // pinyin
  // document.querySelector('div[data-location="2"] span').textContent.split("\n");

  // Build the sentences array
  const selectedSpans = document.querySelectorAll("span[lang]>span");
  // const selectedSpans = document.querySelectorAll('span[lang="zh-TW"]>span');
  const sentencesArray = [];

  selectedSpans.forEach((span) => {
    const textElement = span.querySelector("span:not(:empty)");
    if (textElement) {
      sentencesArray.push(textElement.textContent.trim());
    }
  });

  const transArray = [];

  let currentParagraph = "";

  sentencesArray.slice(1).forEach((sentence) => {
    if (sentence !== "") {
      currentParagraph += sentence + " ";
    } else {
      if (currentParagraph.trim() !== "") {
        transArray.push(currentParagraph.trim());
        currentParagraph = "";
      }
    }
  });

  if (currentParagraph.trim() !== "") {
    transArray.push(currentParagraph.trim());
  }

  // Select the first span with the attribute lang
  const firstSpan = document.querySelectorAll("span[lang]>span")[0];
  const firstTextarea = firstSpan.querySelector("textarea");
  const firstSiblingAfterTextarea = firstTextarea.nextElementSibling;

  const textareaContent = firstSiblingAfterTextarea.innerHTML;
  const origArray = textareaContent.split("\n\n");
  // const origArray = sentencesArray[0].split("\n\n");
  console.log("Original Array:", origArray);

  console.log("Sentences Array:");
  console.log(sentencesArray);
  console.log("Paragraphs Array:");
  console.log(transArray);

  sendResponse({ action: "readText", origArray, transArray, lang1, lang2 });
};

let displayPairedParagraphs = (origArray, transArray) => {
  // Create a new HTML document in the new tab
  const newTabDocument = document.implementation.createHTMLDocument("Paired Paragraphs");

  // Append paired paragraphs to the new document
  for (let i = 0; i < Math.min(origArray.length, transArray.length); i++) {
    const origParagraph = origArray[i];
    const transParagraph = transArray[i];

    const pairedParagraphs = document.createElement("p");
    pairedParagraphs.innerHTML = `<strong>Original:</strong> ${origParagraph}<br><strong>Translated:</strong> ${transParagraph}<br><br>`;

    newTabDocument.body.appendChild(pairedParagraphs);
  }

  // Open the new document in the new tab
  document.open();
  document.write(newTabDocument.documentElement.outerHTML);
  document.close();
};

// Function to notify the background script about the page refresh
// function notifyBackgroundOnRefresh() {
//   chrome.runtime.sendMessage({ refresh: true }, (response) => {
//     if (chrome.runtime.lastError) {
//       console.log("Failed to notify background about refresh:", chrome.runtime.lastError);
//     } else {
//       console.log("Background notified about refresh");
//     }
//   });
// }

// Function to notify the background script about the page refresh
function notifyBackgroundOnRefresh(callback) {
  // Check if the URL matches the expected pattern
  if (document.URL.startsWith("https://tygroovy.com/")) {
    // Send the message to the background script
    chrome.runtime.sendMessage({ refresh: true }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Failed to notify background about refresh:", chrome.runtime.lastError);
      } else {
        console.log("Background notified about refresh");
        if (callback) {
          callback(response); // Pass any relevant data to the callback
        }
      }
    });
  } else {
    console.log("Not on the expected page. Skipping refresh notification.");
  }
}

// Listen for refresh
window.addEventListener("beforeunload", notifyBackgroundOnRefresh);

// Handle gotoChatgpt from the script.js raising and event on click gotoChatgpt
const handleCustomEvent = () => {
  console.log("Custom event received in content.js");
  debugger;
  // Send a message to the background script
  chrome.runtime.sendMessage({ action: "gotoChatgpt", data: "yourData" }, (response) => {
    // Handle the response from the background script if needed
    debugger;
    console.log(response);
  });
};

// Listen for the custom event gotoChatgpt from script.js
document.addEventListener("gotoChatgpt", handleCustomEvent);
