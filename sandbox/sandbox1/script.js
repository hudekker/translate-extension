/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */
// https://developers.google.com/drive/api/quickstart/nodejs?

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = "";
const API_KEY = "";

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/drive";

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById("authorize_button").style.visibility = "hidden";
document.getElementById("signout_button").style.visibility = "hidden";

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById("authorize_button").style.visibility = "visible";
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("authorize_button").innerText = "Refresh";
    // await listFiles();
    // await retrieveFilesInParentFolder();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    document.getElementById("content").innerText = "";
    document.getElementById("authorize_button").innerText = "Authorize";
    document.getElementById("signout_button").style.visibility = "hidden";
  }
}

/**
 * Print metadata for first 10 files.
 */
async function listFiles() {
  let response;
  const folderName = "Personal Stuff";

  try {
    response = await gapi.client.drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
      pageSize: 500,
      fields: "files(id, name)",
    });
  } catch (err) {
    document.getElementById("content").innerText = err.message;
    return;
  }
  const files = response.result.files;
  if (!files || files.length == 0) {
    document.getElementById("content").innerText = "No files found.";
    return;
  }
  // Flatten to string to display
  const output = files.reduce((str, file) => `${str}${file.name} (${file.id})\n`, "Files:\n");
  document.getElementById("content").innerText = output;
}

const parentFolderName = "Personal Stuff";
const fileExtension = ".jpg";

const getFolderIdByName = async (folderName) => {
  try {
    const response = await gapi.client.drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
      fields: "files(id, name)",
    });

    const folders = response.result.files;
    return folders.length > 0 ? folders[0].id : null;
  } catch (error) {
    console.error(`Error retrieving folder ID for "${folderName}":`, error);
    return null;
  }
};

const getSubfolderIds = async (parentFolderId) => {
  try {
    const response = await gapi.client.drive.files.list({
      q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: "files(id, name)",
    });

    return response.result.files.map((subfolder) => subfolder.id);
  } catch (error) {
    console.error(`Error retrieving subfolder IDs:`, error);
    return [];
  }
};

let output = "";

const retrieveFilesInFolder = async (folderId) => {
  try {
    const response = await gapi.client.drive.files.list({
      q: `'${folderId}' in parents and mimeType='image/jpeg' and name contains '${fileExtension}'`,
      pageSize: 500,
      fields: "files(id, name)",
    });

    const jpgFiles = response.result.files;

    if (jpgFiles && jpgFiles.length > 0) {
      console.log(`JPG Files in folder "${folderId}":`);
      jpgFiles.forEach((jpgFile) => {
        output += `File Name: ${jpgFile.name}, File ID: ${jpgFile.id}\n`;
      });
    } else {
      console.log(`No JPG files found in folder "${folderId}".`);
      // Set a message in case no files are found
      document.getElementById("content").innerText = "No JPG files found in the folder.";
    }
  } catch (error) {
    console.error(`Error retrieving JPG files:`, error);
    // Set an error message in case of an error
    document.getElementById("content").innerText = "Error retrieving JPG files.";
  }
};

const retrieveFilesInSubfolders = async (parentFolderId, subfolderIds) => {
  for (const subfolderId of subfolderIds) {
    await retrieveFilesInFolder(subfolderId);
  }
};

const retrieveFilesInParentFolder = async () => {
  const parentFolderId = await getFolderIdByName(parentFolderName);
  if (parentFolderId) {
    console.log(`Parent Folder ID for "${parentFolderName}": ${parentFolderId}`);
    const subfolderIds = await getSubfolderIds(parentFolderId);
    await retrieveFilesInFolder(parentFolderId);
    await retrieveFilesInSubfolders(parentFolderId, subfolderIds);
    // Set the inner text of the "content" element
    document.getElementById("content").innerText = output;
  } else {
    console.log(`No parent folder found with the name "${parentFolderName}".`);
  }
};

// Call the function to retrieve JPG files in the parent folder and its subfolders
