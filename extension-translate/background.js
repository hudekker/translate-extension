const chatGptUrl = "https://chat.openai.com/";

const createTab = (url) =>
  new Promise((resolve) => {
    chrome.tabs.create({ url }, (tab) => {
      resolve(tab);
    });
  });

// Helper function to query tabs
const queryTabs = (url) =>
  new Promise((resolve) =>
    chrome.tabs.query({ url }, (tabs) => {
      resolve(tabs);
    })
  );

// Helper function to update a tab
const updateTab = (tabId, updateProperties) =>
  new Promise((resolve) =>
    chrome.tabs.update(tabId, updateProperties, () => {
      resolve();
    })
  );

// Save data to local storage
const saveDataToLocalStorage = async (data) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(data, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log("Data saved to local storage:", data);
        resolve();
      }
    });
  });
};

// Retrieve data from local storage
const retrieveDataFromLocalStorage = async (keys) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log("Retrieved data from local storage:", result);
        resolve(result);
      }
    });
  });
};

// Function to send a message to content script
const sendMessageToContentScript = async (message) => {
  const tabs = await new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs);
    });
  });

  const response = await new Promise((sendMessageResolve) => {
    console.log(`promise tabs`);
    console.log(tabs);
    chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
      sendMessageResolve(response);
    });
  });

  return response;
};

const sendMessageToTab = async (tabId, message) => {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      // Handle the response if needed
      console.log(`Message sent to tab ${tabId}`, response);
      resolve(response);
    });
  });
};

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

    // // Save data to local storage
    // await saveDataToLocalStorage({ origArray, transArray, lang1, lang2 });

    // Create new tab
    const newTab = await createTab("https://tygroovy.com/bl/blank.html");
    console.log(`newTab.id`);
    console.log(newTab.id);

    // Listen for tab updates
    chrome.tabs.onUpdated.addListener(async function listener(tabId, changeInfo, tab) {
      if (tabId === newTab.id && changeInfo.status === "complete") {
        // Content script is ready, send the message
        sendMessageToTab(newTab.id, { action: "displayData", origArray, transArray, lang1, lang2 });

        // Remove the listener to avoid multiple calls
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });

    // Listen for messages from the content script
    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
      if (request.refresh) {
        const refreshTabId = sender.tab.id;
        // Handle the refresh notification
        console.log("Received refresh notification from content script");

        // Listen for tab updates
        chrome.tabs.onUpdated.addListener(async function listener(tabId, changeInfo, tab) {
          if (tabId === refreshTabId && changeInfo.status === "complete") {
            // Content script is ready, send the message
            sendMessageToTab(refreshTabId, { action: "displayData", origArray, transArray, lang1, lang2 });

            // Remove the listener to avoid multiple calls
            chrome.tabs.onUpdated.removeListener(listener);
          }
        });
      }
      // gotoChatgpt
      if (request.action === "gotoChatgpt") {
        // gotoChatgpt(sendResponse);
      }
    });
  } catch (error) {
    console.error("Error handling icon click:", error);
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "gotoChatgpt") {
    gotoChatgpt(sendResponse);
  }
});

// Helper function to query all tabs with the 'url' property
const queryChatgptTabs = () =>
  new Promise((resolve) =>
    chrome.tabs.query({ url: chatGptUrl + "*" }, (tabs) => {
      resolve(tabs);
    })
  );

const gotoChatgpt = async (sendResponse) => {
  try {
    // Check if a ChatGPT tab exists
    const tabs = await queryChatgptTabs();

    debugger;

    let tabId = "";

    if (tabs && tabs.length > 0) {
      // If a ChatGPT tab exists, activate it
      await updateTab(tabs[0].id, { active: true });
      tabId = tabs[0].id;
    } else {
      // If no ChatGPT tab exists, create a new one, activate it
      const newTab = await createTab(chatGptUrl);
      await updateTab(newTab.id, { active: true });
      tabId = newTab.id;
    }

    sendResponse({ msg: "success", tabId });
  } catch (error) {
    console.error("Error:", error);
    sendResponse({ msg: "error", error });
  }
};

const focusOnChatInput = async (tabId) => {
  // Assuming the input field in ChatGPT has the id 'chatInput'
  const script = `
    document.getElementById('prompt-textarea').focus();
  `;
  return new Promise((resolve) => {
    chrome.tabs.executeScript(tabId, { code: script }, () => {
      resolve();
    });
  });
};

// // Listen for the extension icon click
// chrome.action.onClicked.addListener(async () => {
//   try {
//     console.log("inside background");

//     // Get the active tab
//     const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

//     console.log(activeTab);

//     // Send a message to content script to read the text
//     const response = await sendMessageToContentScript({ action: "readText" });
//     console.log("sent message to context to readText");

//     // Extract data from the response
//     const { origArray, transArray, lang1, lang2 } = response;

//     // Create new tab
//     const newTab = await createTab("https://tygroovy.com/bl/blank.html");
//     console.log(`newTab.id`);
//     console.log(newTab.id);

//     // Listen for tab updates
//     chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
//       if (tabId === newTab.id && changeInfo.status === "complete") {
//         // Content script is ready, send the message
//         sendMessageToTab(newTab.id, { action: "displayData", origArray, transArray, lang1, lang2 });

//         // Remove the listener to avoid multiple calls
//         chrome.tabs.onUpdated.removeListener(listener);
//       }
//     });

//     // Listen for messages from the content script
//     chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//       // Check if the message is about a refresh
//       if (request.refresh) {
//         let refreshTabId = sender.tab.id;
//         // Handle the refresh notification
//         console.log("Received refresh notification from content script");

//         chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
//           if (tabId === refreshTabId && changeInfo.status === "complete") {
//             // Content script is ready, send the message
//             sendMessageToTab(refreshTabId, { action: "displayData", origArray, transArray, lang1, lang2 });

//             // Remove the listener to avoid multiple calls
//             chrome.tabs.onUpdated.removeListener(listener);
//           }
//         });
//       }
//     });
//   } catch (error) {
//     console.error("Error handling icon click:", error);
//   }
// });
// background.js
