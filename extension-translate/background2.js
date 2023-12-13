// Listen for the extension icon click
chrome.action.onClicked.addListener(async () => {
  try {
    console.log("inside background");

    // Get the active tab
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Check if the activeTab is defined
    if (!activeTab) {
      console.error("Active tab is undefined");
      return;
    }

    // Send a message to content script to read the text
    const response = await sendMessageToContentScript({ action: "readText" });

    // Extract data from the response
    const origArray = response.origArray;
    const transArray = response.transArray;

    // Create a new tab
    chrome.tabs.create({ url: chrome.runtime.getURL("blank.html") }, (newTab) => {
      // Send data to the new tab using executeScript for transArray
      for (let i = 0; i < transArray.length; i++) {
        chrome.scripting.executeScript({
          target: { tabId: newTab.id },
          function: (data) => {
            // This function will run in the context of the new tab
            document.body.textContent += data + "\n";
          },
          args: [transArray[i]],
        });
      }

      // Send data to the new tab using executeScript for origArray
      for (let i = 0; i < origArray.length; i++) {
        chrome.scripting.executeScript({
          target: { tabId: newTab.id },
          function: (data) => {
            // This function will run in the context of the new tab
            document.body.textContent += data + "\n";
          },
          args: [origArray[i]],
        });
      }
    });
  } catch (error) {
    console.error("Error handling icon click:", error);
  }
});
