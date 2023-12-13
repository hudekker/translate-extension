function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const sendMessageToTab = async (action) => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const response = await new Promise((sendMessageResolve) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: action }, (response) => {
          sendMessageResolve(response);
        });
      });

      resolve(response);
    });
  });
};

async function getActiveTabId() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTabId = tabs[0] ? tabs[0].id : null;
      resolve(activeTabId);
    });
  });
}

// // Usage example
// document.getElementById("readButton").addEventListener("click", async () => {
//   try {
//     const response = await sendMessageToTab("readText");
//     console.log("send message to content");

//     await sleep(10000);

//     debugger;

//     if (response && response.action === "readText") {
//       transArray = response.transArray;
//       origArray = response.origArray;

//       // Output the contents of the arrays to the console
//       console.log("Translation Array:", transArray);
//       console.log("Original Array:", origArray);

//       // Optionally, you can update the popup content here
//       // document.getElementById("output").textContent = response.text;
//     }
//   } catch (error) {
//     console.error("Error reading text:", error);
//   }
// });

// // Event listener for extension icon button click
// document.addEventListener("DOMContentLoaded", async function () {
//   try {
//     console.log("send message to content from extension icon");
//     const response = await sendMessageToTab("readText");

//     if (response && response.action === "readText") {
//       transArray = response.transArray;
//       origArray = response.origArray;

//       // Create a new window with a single tab
//       chrome.windows.create({ url: chrome.runtime.getURL("blank.html"), type: "popup" }, async (newWindow) => {
//         debugger;

//         const activeTabId = await getActiveTabId();
//         console.log("Active Tab ID:", activeTabId);

//         const newTabId = newWindow.tabs[0].id;
//         console.log("New Active Tab ID:", newTabId);

//         chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
//           if (tabId === newTabId && changeInfo.status === "complete") {
//             chrome.tabs.onUpdated.removeListener(listener);

//             // Create a new document in the new tab
//             chrome.tabs.sendMessage(newTabId, {
//               action: "displayPairedParagraphs",
//               origArray: origArray,
//               transArray: transArray,
//             });
//           }
//         });
//       });
//     }
//   } catch (error) {
//     console.error("Error reading text:", error);
//   }
// });

document.getElementById("readButton").addEventListener("click", async () => {
  try {
    console.log("send message to content from extension icon");
    const response = await sendMessageToTab("readText");

    if (response && response.action === "readText") {
      transArray = response.transArray;
      origArray = response.origArray;

      // Create a new tab and set its URL to a blank HTML page
      // chrome.tabs.create({ url: chrome.runtime.getURL("blank.html") }, (newTab) => {
      chrome.tabs.create({ url: "https://hudektech.com" }, async (newTab) => {
        await sleep(5000);
        // Create a new document in the new tab
        debugger;

        chrome.tabs.sendMessage(newTab.id, {
          action: "displayPairedParagraphs",
          origArray: origArray,
          transArray: transArray,
        });

        // chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        //   if (tabId === newTab.id && changeInfo.status === "complete") {
        //     chrome.tabs.onUpdated.removeListener(listener);

        //     // Create a new document in the new tab
        //     chrome.tabs.sendMessage(newTab.id, {
        //       action: "displayPairedParagraphs",
        //       origArray: origArray,
        //       transArray: transArray,
        //     });
        //   }
        // });
      });
    }
  } catch (error) {
    console.error("Error reading text:", error);
  }
});
