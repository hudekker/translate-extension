

const credentials = {
  "installed": {
    "redirect_uris": REDIRECT_URIS,
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "project_id": PROJECT_ID
  }
}

const scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/calendar.readonly'
  // 'https://www.googleapis.com/auth/drive.metadata.readonly',
  // Add other scopes as needed
];

const fetchDataBtn = async () => {
  try {
    const response = await fetch('http://localhost:3000/authenticateAndTokenize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credentials: credentials, scopes: scopes }),
    });

    const data = await response.json();
    const { client, tokens, gdrive } = data;

    // Use the gdrive object to interact with Google Drive
    const res = await gdrive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    });

    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.forEach(file => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};


