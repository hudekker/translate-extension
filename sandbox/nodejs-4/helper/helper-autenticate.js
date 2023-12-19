const { authenticate } = require('@google-cloud/local-auth');
const path = require('path');

const fs = require('fs').promises; // Use fs.promises for consistency
const { google } = require('googleapis');

async function saveCredentials(client, credentialsPath, tokenPath) {
  const content = await fs.readFile(credentialsPath, 'utf8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });

  await fs.writeFile(tokenPath, payload);
}

const authorizeAndSaveCredentials = async (scopes, credentialsPath, tokenPath) => {
  const auth = await authenticate({
    keyfilePath: credentialsPath,
    scopes: scopes,
  });

  if (auth.credentials) {
    await saveCredentials(auth, credentialsPath, tokenPath);
  }

  let drive = google.drive({
    version: 'v3',
    auth,
  });

  return { drive, auth };
}

// Export multiple functions
module.exports = {
  authorizeAndSaveCredentials,
};