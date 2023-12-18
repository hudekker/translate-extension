'use strict';

const { google } = require('googleapis');
const fs = require('fs');
const os = require('os');
const path = require('path');
const uuid = require('uuid');
const { authenticate } = require('@google-cloud/local-auth');

const drive = google.drive('v3');

async function runSample(fileId) {
  // Obtain user credentials to use for the request
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, '../oauth2.keys.json'),
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
  google.options({ auth });

  // Check if the file is associated with Google Docs editors
  const fileMetadata = await drive.files.get({ fileId });
  const isGoogleDocsFile = fileMetadata.data.mimeType.startsWith('application/vnd.google-apps');

  if (isGoogleDocsFile) {
    // For Google Docs files, use export instead of get
    return drive.files.export({ fileId, mimeType: 'application/pdf' }, { responseType: 'stream' })
      .then(res => {
        return new Promise((resolve, reject) => {
          const downloadsDir = path.join(__dirname, 'downloads');
          if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir);
          }

          const filePath = path.join(downloadsDir, `${uuid.v4()}.pdf`);
          const dest = fs.createWriteStream(filePath);
          let progress = 0;

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
  } else {
    // For other file types, use the get method
    return drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' })
      .then(res => {
        // ... (same as before)
      });
  }
}

if (module === require.main) {
  if (process.argv.length !== 3) {
    throw new Error('Usage: node samples/drive/download.js $FILE_ID');
  }
  const fileId = process.argv[2];
  runSample(fileId).catch(console.error);
}
module.exports = runSample;