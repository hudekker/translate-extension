// Your Google API Client ID (replace with your own)
const CLIENT_ID =
  "138224583990-bu3h1m4gqipmpmqjhrq9af9jb9ug2ffu.apps.googleusercontent.com";

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/spreadsheets",
  // Add other scopes as needed
];

// Function called when the Google API client is loaded
function onClientLoad() {
  gapi.load("picker", { callback: onPickerApiLoad });
}

// Function called when the Google Picker API is loaded
function onPickerApiLoad() {
  // Create a Google Picker object
  const picker = new google.picker.PickerBuilder()
    .addView(google.picker.ViewId.DOCS)
    .addView(google.picker.ViewId.FOLDERS)
    .setOAuthToken(
      "ya29.a0AfB_byCjCqyt3YV2mHxTbwta8pF2hqD0NtYUIdOt4Adlw4JShgShyCjCGfZD3KGpRQROmDMBn-opnovjOKmhjWIkpte96I3iJbRPGwIQ5zIt15Ruddxt9isSqGQ7pA2eX58hVuZtOxLxbFJhM0j4sqEt8UHeRFYZdg-FaCgYKAcISARESFQHGX2MiBHbP8DEKTwwKuV4NIxMDhA0171"
    ) // Use OAuth 2.0 token here if required
    .setDeveloperKey("AIzaSyD1WjB3Exm9NVxw4IgwE-qN-n7nhx76icw") // Use developer key here if required
    .setCallback(pickerCallback)
    .build();

  // Attach a click event to the "Open Picker" button
  document.getElementById("open-picker").addEventListener("click", () => {
    picker.setVisible(true);
  });
}

// Callback function for when a file is picked
// function pickerCallback(data) {
//   if (data.action === google.picker.Action.PICKED) {
//     const fileId = data.docs[0].id;
//     const fileName = data.docs[0].name;
//     alert(`You picked file with ID: ${fileId} and name: ${fileName}`);
//   }
// }

async function pickerCallback(data) {
  if (data.action === google.picker.Action.PICKED) {
    let text = `Picker response: \n${JSON.stringify(data, null, 2)}\n`;
    const document = data[google.picker.Response.DOCUMENTS][0];
    const fileId = document[google.picker.Document.ID];
    console.log(fileId);
    const res = await gapi.client.drive.files.get({
      fileId: fileId,
      fields: "*",
    });
    text += `Drive API response for first document: \n${JSON.stringify(
      res.result,
      null,
      2
    )}\n`;
    window.document.getElementById("content").innerText = text;
  }
}

// Function called when the Google API client is loaded
function onClientLoad() {
  console.log("inside onClientLoad");
  // Load the API client library and authenticate the user
  // gapi.load("client", () => {
  //   gapi.client
  //     .init({
  //       clientId: CLIENT_ID,
  //       scope: SCOPES.join(" "), // Convert the array of scopes into a space-separated string
  //     })
  //     .then(() => {
  //       console.log("inside onclientload, inside the then");
  //       // Initialize the Picker API after the client is authenticated

  //       // You can now use the authenticated client to interact with Google services
  //     });
  // });
  gapi.load("picker", { callback: onPickerApiLoad });
  // onApiLoad(); // Call your own function to handle API interactions
}

console.log("test");

// Attach a click event to the "Open Picker" button
