// Replace 'YOUR_CLIENT_ID' with your actual OAuth 2.0 client ID.
const clientId = "YOUR_CLIENT_ID";

let selectedFolderName = "None";

const showFolderPicker = async () => {
  // Use the Google Picker API to select a destination folder.
  const folderId = await pickFolder();

  // If the user cancels folder selection, folderId will be null.
  if (folderId !== null) {
    // Update the selected folder name for display.
    selectedFolderName = folderId === "root" ? "Root Folder" : `Folder: ${folderId}`;
    document.getElementById("selectedFolder").innerText = `Selected Folder: ${selectedFolderName}`;
  }
};

const authenticateUser = async () => {
  const auth2 = await gapi.auth2.init({
    client_id: clientId,
  });

  const googleUser = await auth2.signIn();
  handleSignIn(googleUser);
};

const handleSignIn = async (googleUser) => {
  const authResponse = googleUser.getAuthResponse();

  // Use authResponse.id_token for user identity verification.
  // ...

  // Use authResponse.access_token as the user-specific access token.
  const userAccessToken = authResponse.access_token;

  // Initialize the Google Drive API.
  await gapi.client.load("drive", "v3");

  // Enable the file upload input after signing in.
  document.getElementById("uploadFile").removeAttribute("disabled");
};

const pickFile = (accessToken) => {
  const picker = new google.picker.PickerBuilder().addView(google.picker.ViewId.DOCS).setOAuthToken(accessToken).setCallback(pickerCallback).build();
  picker.setVisible(true);
};

const pickerCallback = (data) => {
  if (data.action === google.picker.Action.PICKED) {
    const fileId = data.docs[0].id;
    const fileName = data.docs[0].name;

    // Update the file content (for demonstration purposes).
    updateFileContent(fileId, fileName);

    // Retrieve and display the file content.
    retrieveFileContent(fileId);
  }
};

const updateFileContent = async (fileId, fileName) => {
  const newContent = `Updated content for ${fileName}`;

  try {
    const response = await gapi.client.drive.files.update({
      fileId,
      media: {
        mimeType: "text/plain",
        body: newContent,
      },
    });

    console.log("File updated successfully:", response.result);
  } catch (error) {
    console.error("Error updating file:", error);
  }
};

const retrieveFileContent = async (fileId) => {
  try {
    const response = await gapi.client.drive.files.get({
      fileId,
      alt: "media",
    });

    console.log("File content:", response.body);
  } catch (error) {
    console.error("Error retrieving file content:", error);
  }
};

const retrieveFileById = () => {
  const fileId = document.getElementById("retrieveFileId").value;
  retrieveFileContent(fileId);
};

const uploadSelectedFile = async () => {
  const fileInput = document.getElementById("uploadFile");
  const file = fileInput.files[0];

  if (file) {
    // Use the Google Picker API to select a destination folder.
    const folderId = await pickFolder();

    // If the user cancels folder selection, folderId will be null.
    if (folderId !== null) {
      // Update the selected folder name for display.
      selectedFolderName = folderId === "root" ? "Root Folder" : `Folder: ${folderId}`;
      document.getElementById("selectedFolder").innerText = `Selected Folder: ${selectedFolderName}`;

      // Upload the file with the selected destination folder.
      uploadFile(file, folderId);
    }
  }
};

const pickFolder = () => {
  return new Promise((resolve) => {
    const picker = new google.picker.PickerBuilder()
      .addView(new google.picker.DocsView(google.picker.ViewId.FOLDERS))
      .setCallback((data) => {
        if (data.action === google.picker.Action.PICKED) {
          const folderId = data.docs[0].id;
          resolve(folderId);
        } else {
          resolve(null); // User canceled folder selection
        }
      })
      .build();
    picker.setVisible(true);
  });
};

const uploadFile = async (file, folderId) => {
  try {
    const metadata = {
      name: file.name,
      parents: [folderId],
    };

    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", file);

    const response = await gapi.client.request({
      path: "https://www.googleapis.com/upload/drive/v3/files",
      method: "POST",
      params: { uploadType: "multipart" },
      headers: {
        "Content-Type": "multipart/related; boundary=foo_bar_baz",
      },
      body: form,
    });

    console.log("File uploaded successfully:", response.result);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
