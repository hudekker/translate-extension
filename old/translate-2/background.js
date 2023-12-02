// Function to handle OAuth 2.0 flow
async function authenticateWithGoogle() {
  // Redirect user to Google's authentication endpoint
  const authUrl = "https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=YOUR_SCOPES&response_type=code";

  chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, async (redirectUrl) => {
    const code = new URLSearchParams(new URL(redirectUrl).search).get("code");

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `code=${code}&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&redirect_uri=YOUR_REDIRECT_URI&grant_type=authorization_code`,
    });

    const tokenData = await tokenResponse.json();

    // Store the access token securely (e.g., using chrome.storage)
    chrome.storage.local.set({ accessToken: tokenData.access_token });
  });
}

// try this test
// background.service_worker.js
chrome.runtime.onInstalled.addListener(() => {
  authenticateWithGoogle();

  chrome.contextMenus.create({
    title: "Select All Paragraphs",
    contexts: ["selection"],
    id: "selectParagraphs",
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
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
