require('dotenv').config();
const http = require('http');
const url = require('url');
const { google } = require('googleapis');

// const { authenticate } = require('./helper/helper-authenticate.js');
const { getTree } = require('./helper/helper-tree.js');
const { listEvents } = require('./helper/helper-calendar.js');
const { config } = require('dotenv');



/**
 * Perform OAuth2 flow to retrieve tokens.
 * @param {string} clientId - Google Cloud Console Client ID.
 * @param {string} clientSecret - Google Cloud Console Client Secret.
 * @param {string} redirectUri - Redirect URI provided by the user.
 * @param {Array<string>} scopes - Array of OAuth2 scopes.
 * @returns {Promise<{client: OAuth2Client, tokens: Object}>} - OAuth2 client and tokens.
 */
async function performOAuthFlow(clientId, clientSecret, redirectUri, scopes) {
  // ... (rest of the code remains the same)
}

// Load environment variables
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URIS;
const scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/calendar.readonly'
];

(async () => {
  try {
    async function performOAuthFlow(clientId, clientSecret, redirectUri, scopes) {
      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' '),
      });

      const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url, true);
        console.log(parsedUrl);
        debugger;

        if (parsedUrl.pathname === '/') {
          res.writeHead(302, { 'Location': authUrl });
          res.end();
          return;
        }

        if (parsedUrl.pathname === '/oauthcallback') {
          const code = parsedUrl.query.code;

          if (code) {
            oauth2Client.getToken(code, (err, tokens) => {
              if (err) {
                throw new Error(`Error exchanging code for tokens: ${err.message}`);
              }

              oauth2Client.setCredentials(tokens);
              console.log('Tokens:', tokens);

              res.writeHead(200, { 'Content-Type': 'text/plain' });
              res.end('Authorization successful. You can close this window.');

              server.close(() => {
                console.log('Server closed.');
              });
            });
          } else {
            res.writeHead(400);
            res.end('Authorization code not found.');
          }

          return;
        }

        res.writeHead(404);
        res.end('Not Found');
      });

      server.listen(0, () => {
        const port = server.address().port;
        console.log(`Server running on http://localhost:${port}`);
      });

      return new Promise((resolve, reject) => {
        server.on('close', () => {
          resolve({ client: oauth2Client, tokens: oauth2Client.credentials });
        });

        server.on('error', reject);
      });
    }



    //
    debugger;
    const { client, tokens } = await performOAuthFlow(clientId, clientSecret, redirectUri, scopes);
    console.log('OAuth2 client:', client);
    console.log('Tokens:', tokens);

    const gdrive = google.drive({
      version: 'v3',
      auth: client,
    });

    // Initialize Google Calendar client
    const calendar = google.calendar({
      version: 'v3',
      auth: client, // Assuming 'client' is your authorized OAuth2 client
    });

    await listEvents(calendar);

    let tree = await getTree(gdrive);
    console.table(tree)

  } catch (error) {
    console.error('Error:', error);
  }
})();
