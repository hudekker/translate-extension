(async () => {
  const { google } = require("googleapis");
  const { OAuth2Client } = require("google-auth-library");
  const { config } = require("dotenv");

  config();

  // const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

  // Extract values from environment variables
  const redirectUris = process.env.REDIRECT_URIS;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const projectId = process.env.PROJECT_ID;
  const apiKey = process.env.API_KEY;
  const scopes = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/spreadsheets",
    // 'https://www.googleapis.com/auth/drive.metadata.readonly',
    // Add other scopes as needed
  ];

  const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUris);

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const pageSize = 100; // Number of files to retrieve per page
  let nextPageToken = null;

  const listFiles = async () => {
    const params = {
      pageSize,
      pageToken: nextPageToken,
      fields: "nextPageToken, files(id, name)", // Specify the fields you want to retrieve
    };

    try {
      const response = await drive.files.list(params);
      const files = response.data.files;

      if (files.length > 0) {
        // Process and display the files, e.g., add them to your viewer
        files.forEach((file) => {
          console.log(`${file.name} (${file.id})`);
        });

        // Check if there are more pages
        nextPageToken = response.data.nextPageToken;

        if (nextPageToken) {
          // Fetch the next page when the user scrolls to the bottom or triggers a "Load more" action
          // You can call listFiles() again with the new nextPageToken
        } else {
          console.log("No more files.");
        }
      } else {
        console.log("No files found.");
      }
    } catch (error) {
      console.error("Error listing files:", error);
    }
  };

  listFiles();

  // const credentials = require("./path-to-your-credentials.json");
})();
