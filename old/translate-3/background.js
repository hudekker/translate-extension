

const chromeTabsExecuteScriptFunction = async (payload) => {
  return new Promise((resolve, reject) => {
    // chrome.tabs.executeScript(tabId, payload, (tab) => resolve(tab));
    chrome.scripting.executeScript(payload);
  });
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};


const writeReportLines = async (strArr) => {
  // Get the Array
  // let { breakoutReport: strArr } = await chromeStorageLocalGet("breakoutReport");
  // Print the Array
  document.title = strArr[0];
  for (let i = 1; i < strArr.length; i++) {
    document.writeln(`${strArr[i]}`);
  }
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateSelection",
    title: "Translate Selection",
    contexts: ["selection"]
  });

  // Create a context menu item for translating the entire document
  chrome.contextMenus.create({
    id: "translateDocument",
    title: "Translate Document",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log('inside context menue clicked');

  debugger;

  if (info.menuItemId === "translateSelection") {
    chrome.tabs.sendMessage(tab.id, { action: "getSelectedContent" });

    // const selectedText = info.selectionText;

    // // const selectedText = window.getSelection().toString();
    // const paragraphs = selectedText.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('');

    // const formattedText = `<html><head><link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL('styles.css')}"></head><body>${paragraphs}</body></html>`;

    // const newTab = await chrome.tabs.create({ url: "https://hudektech.com/#status-students" });



    // // Send a message to the new tab to initiate translation
    // chrome.tabs.sendMessage(newTab.id, { action: 'translate', data: formattedText });



  }

});
