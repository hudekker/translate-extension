'use strict';

const { google } = require('googleapis');
const fs = require('fs');
const os = require('os');
const uuid = require('uuid');
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Extract values from environment variables
const redirectUris = process.env.REDIRECT_URIS;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const projectId = process.env.PROJECT_ID;

const drive = google.drive('v3');

async function runSample(fileId, directoryPath) {
  // Create a temporary JSON file with your credentials
  const credentials = {
    web: {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUris],
      project_id: projectId,
    },
  };

  const tempKeyfilePath = path.join(__dirname, 'temp-credentials.json');

  fs.writeFileSync(tempKeyfilePath, JSON.stringify(credentials));

  // Use the temporary keyfile path in the authenticate function
  const auth = await authenticate({
    keyfilePath: tempKeyfilePath,
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.appdata',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata',
      'https://www.googleapis.com/auth/drive.metadata.readonly',
      'https://www.googleapis.com/auth/drive.photos.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
    ],
  });

  // Remember to delete the temporary keyfile after authentication
  fs.unlinkSync(tempKeyfilePath);

  google.options({ auth });

  // Use the Google Drive API to list files in the specified directory
  const listResponse = await drive.files.list({
    q: `name='${directoryPath}' and mimeType='application/vnd.google-apps.folder'`,
  });

  const directory = listResponse.data.files[0]; // Assuming there is only one directory with the given name

  if (!directory) {
    throw new Error(`Directory '${directoryPath}' not found.`);
  }

  // Search for the file in the specified directory
  const filesResponse = await drive.files.list({
    q: `'${directory.id}' in parents and name='${fileId}'`,
  });

  const file = filesResponse.data.files[0];

  if (!file) {
    throw new Error(`File '${fileId}' not found in directory '${directoryPath}'.`);
  }

  // Now you have the file ID, you can proceed with the download
  return downloadFile(file.id);
}

async function downloadFile(fileId) {
  // Use the Google Drive API to download the file
  return drive.files
    .get({ fileId, alt: 'media' }, { responseType: 'stream' })
    .then(res => {
      return new Promise((resolve, reject) => {
        // File is saved to the "downloads" directory with a unique filename
        const downloadsDir = path.join(__dirname, '..', 'downloads');
        if (!fs.existsSync(downloadsDir)) {
          fs.mkdirSync(downloadsDir);
        }

        const filePath = path.join(downloadsDir, `${uuid.v4()}.downloaded`);
        const dest = fs.createWriteStream(filePath);
        let progress = 0;

        // Stream events to track the download progress
        res.data
          .on('end', () => {
            console.log(`Done downloading file. File saved to: ${filePath}`);
            resolve(filePath);
          })
          .on('error', err => {
            console.error('Error downloading file.');
            reject(err);
          })
          .on('data', d => {
            progress += d.length;
            if (process.stdout.isTTY) {
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(`Downloaded ${progress} bytes`);
            }
          })
          .pipe(dest);
      });
    });
}

if (module === require.main) {
  if (process.argv.length !== 4) {
    throw new Error('Usage: node samples/drive/download.js $DIRECTORY_PATH $FILE_NAME');
  }
  const directoryPath = process.argv[2];
  const fileName = process.argv[3];
  runSample(fileName, directoryPath).catch(console.error);
}

module.exports = runSample;
