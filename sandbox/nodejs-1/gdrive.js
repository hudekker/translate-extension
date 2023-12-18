'use strict';

const { google } = require('googleapis');

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { authorizeAndSaveCredentials } = require('./helper/helper-autenticate');
const { getTree } = require('./helper/helper-tree')

// Load environment variables from .env file
dotenv.config({ path: '.env', encoding: 'utf8', debug: true });

// Extract values from environment variables
const redirectUris = process.env.REDIRECT_URIS;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const projectId = process.env.PROJECT_ID;

const credentialsJson = {
  installed: {
    redirect_uris: [redirectUris],
    client_id: clientId,
    client_secret: clientSecret,
    project_id: projectId,
  }
}

const scopes = [
  'https://www.googleapis.com/auth/drive',
  // 'https://www.googleapis.com/auth/drive.metadata.readonly',
  // Add other scopes as needed
];

// Main process
(async () => {

  try {

    // Credentials path
    const tokenPath = path.join(process.cwd(), 'token.json');
    const credentialsPath = path.join(process.cwd(), 'tempCredentials.json');

    // Login
    fs.writeFileSync(credentialsPath, JSON.stringify(credentialsJson));
    let { drive, auth } = await authorizeAndSaveCredentials(scopes, credentialsPath, tokenPath);
    fs.unlinkSync(credentialsPath);

    // google.options({ client });

    // Get the folder tree
    let tree = await getTree(drive);
    console.table(tree)

  } catch (error) {
    console.error('Error:', error.message);
  }
})();
