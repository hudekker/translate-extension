import express from 'express';
import { authenticateAndTokenize } from './helper/helper-authenticate.js';
import { getTree } from './helper/helper-tree.js';
import { listEvents } from './helper/helper-calendar.js';
import { config } from 'dotenv';
import { google } from "googleapis";
// import pkg from 'cors';
// const { cors } = pkg;
import cors from 'cors';


config();

// const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

// Extract values from environment variables
const redirectUris = process.env.REDIRECT_URIS;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const projectId = process.env.PROJECT_ID;

const credentials = {
  "installed": {
    "redirect_uris": redirectUris,
    "client_id": clientId,
    "client_secret": clientSecret,
    "project_id": projectId
  }
}
const scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/calendar.readonly'
  // 'https://www.googleapis.com/auth/drive.metadata.readonly',
  // Add other scopes as needed
];
// Enable CORS for all routes
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// API endpoint to handle authentication and tokenization
app.post('/authenticateAndTokenize', async (req, res) => {
  try {
    const { credentials, scopes } = req.body;
    const { client, tokens } = await authenticateAndTokenize({ credentials: credentials, scopes: scopes });

    // Initialize Google Drive client
    const gdrive = google.drive({
      version: 'v3',
      auth: client,
    });

    // Initialize Google Calendar client
    const calendar = google.calendar({
      version: 'v3',
      auth: client, // Assuming 'client' is your authorized OAuth2 client
    });

    const apis = google.getSupportedAPIs();

    debugger;

    // await listEvents(calendar);
    res.json({ client, tokens, gdrive });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
