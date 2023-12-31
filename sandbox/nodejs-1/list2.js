const { google } = require('googleapis');
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');

let list = []

async function getFilesInDirectory(directoryName) {
  // Authenticate and obtain user credentials
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, '../oauth2.keys.json'),
    scopes: 'https://www.googleapis.com/auth/drive.metadata.readonly',
  });

  // Set up the Google Drive API service
  const drive = google.drive({ version: 'v3', auth });

  try {
    // Get the folder ID for the specified directory name
    const folderId = await getDirectoryId(directoryName, drive);
    if (!folderId) {
      console.log(`Directory '${directoryName}' not found.`);
      return;
    }

    // Use the files.list method to retrieve files in the specified directory
    const response = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name, mimeType)',
    });

    // Check if any files were found
    const files = response.data.files;
    if (files.length === 0) {
      console.log(`No files found in '${directoryName}'.`);
    } else {
      console.log(`Files in '${directoryName}':`);
      for (const file of files) {
        const fileType = file.mimeType;
        const fileName = file.name;
        const fileExtension = path.extname(fileName);

        list.push({ fileName, fileId: file.id, fileType, fileExtension })

        // console.log(`${fileName} (${file.id}) - Type: ${fileType}, Extension: ${fileExtension}`);
      }

      console.table(list);
    }
  } catch (error) {
    console.error('Error retrieving files:', error.message);
  }
}

async function getDirectoryId(directoryName, drive) {
  try {
    // Use the files.list method to search for the directory by name
    const response = await drive.files.list({
      q: `name='${directoryName}' and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    });

    // Check if the directory was found
    const directories = response.data.files;
    if (directories.length === 0) {
      return null;
    }

    // Retrieve the directory ID
    return directories[0].id;
  } catch (error) {
    console.error('Error retrieving directory ID:', error.message);
    return null;
  }
}

// Example: Get all files inside the 'Miscel' directory with type and extension information
getFilesInDirectory('root');
