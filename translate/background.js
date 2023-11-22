// background.service_worker.js
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: "Select All Paragraphs",
    contexts: ["selection"],
    id: "selectParagraphs"
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "selectParagraphs") {
    chrome.tabs.sendMessage(tab.id, { action: "selectParagraphs" });
  }
});

chrome.runtime.onMessage.addListener(({ action, data }, sender, sendResponse) => {
  if (action === "navigateAndPaste" && Array.isArray(data)) {
    // Check if there's an open tab with chat.openai.com
    chrome.tabs.query({ url: "https://chat.openai.com/*" }, (tabs) => {
      if (tabs.length > 0) {
        // If there is an open tab, navigate to it
        chrome.tabs.update(tabs[0].id, { active: true }, () => {
          // After the tab is active, send a message to paste the data
          chrome.tabs.sendMessage(tabs[0].id, { action: "pasteData", data });
        });
      } else {
        // If no open tab, open a new tab with chat.openai.com
        chrome.tabs.create({ url: "https://chat.openai.com/" }, (tab) => {
          // After the tab is created, send a message to paste the data
          chrome.tabs.sendMessage(tab.id, { action: "pasteData", data });
        });
      }
    });
  }
});