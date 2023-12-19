import { OAuth2Client } from 'google-auth-library';
import express from 'express';
import url from 'url';
import open from 'open';
import dotenv from 'dotenv';
const { google } = require('googleapis');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: '.env', encoding: 'utf8', debug: true });

const app = express();
const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

// Extract values from environment variables
const redirectUris = process.env.REDIRECT_URIS;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const scopes = [
  'https://www.googleapis.com/auth/drive',
  // 'https://www.googleapis.com/auth/drive.metadata.readonly',
  // Add other scopes as needed
];

let oAuth2Client; // Declare oAuth2Client at the module level


// Routes
app.get('/auth', async (req, res) => {
  try {
    const qs = new url.URL(req.url, `${redirectUris}`).searchParams;
    // const qs = new url.URL(req.url, `http://localhost:${port}`).searchParams;
    const code = qs.get('code');
    console.log(`Code is ${code}`);
    res.end('Authentication successful! Please return to the console.');

    const r = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(r.tokens);
    console.log(r.tokens);
    console.info('Tokens acquired.');
  } catch (e) {
    console.error(e);
  }
});

// Root route to trigger the main function
app.get('/', async (req, res) => {
  try {
    // Create the oath2client
    oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUris);

    // Generate authorizeUrl
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    // Open the browser for authorization
    open(authorizeUrl, { wait: false }).then(cp => cp.unref());

  } catch (error) {
    console.error(error);
  }

  res.send('Authorization completed. Check the console for details.');
});

// Listen to the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  if (process.env.NODE_ENV !== 'production') {
    open(`http://localhost:${port}`);
  }
});
