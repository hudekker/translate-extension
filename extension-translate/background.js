// Function to send a message to content script
async function sendMessageToContentScript(message) {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const response = await new Promise((sendMessageResolve) => {
        console.log(`promise tabs`);
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          sendMessageResolve(response);
        });
      });

      resolve(response);
    });
  });
}

const sendMessageToTab = async (tabId, message) => {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      // Handle the response if needed
      console.log(`Message sent to tab ${tabId}`, response);
      resolve(response);
    });
  });
};

const createTab = (url) =>
  new Promise((resolve) => {
    chrome.tabs.create({ url }, (tab) => {
      resolve(tab);
    });
  });

// Listen for the extension icon click
chrome.action.onClicked.addListener(async () => {
  try {
    console.log("inside background");

    // Get the active tab
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

    console.log(activeTab);

    // Send a message to content script to read the text
    const response = await sendMessageToContentScript({ action: "readText" });
    console.log("sent message to context to readText");

    // Extract data from the response
    const { origArray, transArray, lang1, lang2 } = response;
    // const origArray = response.origArray;
    // const transArray = response.transArray;
    // const lang1 = response.lang1;
    // const lang2 = response.lang2;

    // Create new tab
    const newTab = await createTab("https://tygroovy.com/bl/blank.html");
    console.log(`newTab.id`);
    console.log(newTab.id);

    // Listen for tab updates
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
      if (tabId === newTab.id && changeInfo.status === "complete") {
        // Content script is ready, send the message
        sendMessageToTab(newTab.id, { action: "displayData", origArray, transArray, lang1, lang2 });

        // Remove the listener to avoid multiple calls
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  } catch (error) {
    console.error("Error handling icon click:", error);
  }
});
