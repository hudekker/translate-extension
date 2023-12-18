// Copyright 2016 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');

const drive = google.drive('v3');


async function getFolderIdByName(folderName) {
  try {
    const response = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name, mimeType)',
    });

    const allFolders = response.data.files;
    console.log('All Folders:', allFolders);

    const folder = allFolders.find(f => f.name === folderName);
    return folder ? folder.id : null;
  } catch (error) {
    console.error('Error retrieving folders:', error.message);
    return null;
  }
}
// ... (previous code)

async function runSample(fileName) {
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, '../oauth2.keys.json'),
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  google.options({ auth });

  const folderName = 'Miscel';

  // Retrieve the folder ID by name
  const folderId = await getFolderIdByName(folderName);

  // Check if the folder ID was retrieved successfully
  if (!folderId) {
    console.error(`Folder '${folderName}' not found.`);
    return; // Abort the script if the folder is not found
  } else {
    console.log(`Folder ID for '${folderName}': ${folderId}`);
  }

  try {
    const fileSize = fs.statSync(fileName).size;
    const res = await drive.files.create(
      {
        requestBody: {
          name: path.basename(fileName),
          description: 'A sample file upload to Google Drive',
          mimeType: 'text/plain',
          parents: [folderId],
        },
        media: {
          body: fs.createReadStream(fileName),
        },
      },
      {
        onUploadProgress: evt => {
          const progress = (evt.bytesRead / fileSize) * 100;
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0);
          process.stdout.write(`${Math.round(progress)}% complete`);
        },
      }
    );
    console.log(res.data);
  } catch (error) {
    console.error('Error uploading file:', error.message);
  }
}

// ... (rest of the code)

// if invoked directly (not tests), authenticate and run the samples
if (module === require.main) {
  const fileName = process.argv[2];
  runSample(fileName).catch(console.error);
}
module.exports = runSample;