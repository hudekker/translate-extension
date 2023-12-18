let tokenClient;
let accessToken = null;
let pickerInited = false;
let gisInited = false;

// Use the API Loader script to load google.picker
function onApiLoad() {
  gapi.load('picker', onPickerApiLoad);
}

function onPickerApiLoad() {
  pickerInited = true;
}

const API_KEY = 'AIzaSyD1WjB3Exm9NVxw4IgwE-qN-n7nhx76icw';
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
const CLIENT_ID = '138224583990-m2bbqsgjvto1r6kmhmbvfb662aa77200.apps.googleusercontent.com';

function gisLoaded() {
  // TODO(developer): Replace with your client ID and required scopes.
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
}

// Create and render a Google Picker object for selecting from Drive.
function createPicker() {
  const showPicker = () => {
    // TODO(developer): Replace with your API key
    const picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.DOCS)
      .setOAuthToken(accessToken)
      .setDeveloperKey(API_KEY)
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  }

  // Request an access token.
  tokenClient.callback = async (response) => {
    if (response.error !== undefined) {
      throw (response);
    }
    accessToken = response.access_token;
    showPicker();
  };

  if (accessToken === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

// A simple callback implementation.
function pickerCallback(data) {
  let url = 'nothing';
  if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
    let doc = data[google.picker.Response.DOCUMENTS][0];
    url = doc[google.picker.Document.URL];
  }
  let message = `You picked: ${url}`;
  document.getElementById('result').innerText = message;
}
