const express = require("express");
const app = express();
const { authenticateAndTokenize } = require("./helper/helper-authenticate.js");
const { getTree } = require("./helper/helper-tree.js");
const { config } = require("dotenv");
const { google } = require("googleapis");
const fs = require("fs");

config();

// const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

// Extract values from environment variables
const redirectUris = process.env.REDIRECT_URIS;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const projectId = process.env.PROJECT_ID;
const scopes = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/spreadsheets",
];

const credentials = {
  installed: {
    redirect_uris: redirectUris,
    client_id: clientId,
    client_secret: clientSecret,
    project_id: projectId,
  },
};

const apiKey = process.env.API_KEY;

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUris // This should match the one in Google Cloud Console
);

app.set("view engine", "ejs");

// Serve static files from the public directory
app.use(express.static("public"));

// Environment variables for configuration

app.get("/auth", (req, res) => {
  // Generate the url that will be used for the consent dialog.
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    // scope: ["https://www.googleapis.com/auth/drive"],
  });

  console.log("inside auth");
  console.log(authUrl);

  res.redirect(authUrl);
});

app.get("/robbie", async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code);

  console.log("inside robbie");

  oauth2Client.setCredentials(tokens);

  // Here, you would typically store the tokens securely and redirect to your front-end
  res.redirect("/?token=" + tokens.access_token);
});

// Now modify your '/' route to accept the token
app.get("/", async (req, res) => {
  // const { client } = await authenticateAndTokenize(credentials, scopes);

  // // Initialize Google Drive client
  // const gdrive = google.drive({
  //   version: "v3",
  //   auth: client,
  // });

  // let tree = await getTree(gdrive);
  // console.table(tree);

  res.render("index", {
    clientId: clientId,
    apiKey: apiKey,
    token: req.query.token, // Pass the token to the front-end
  });
});
// // Home route
// app.get("/", async (req, res) => {
//   const { clientId, tokens } = await authenticateAndTokenize(
//     credentials,
//     scopes
//   );

//   res.render("index", {
//     clientId: clientId,
//     apiKey: apiKey,
//     token: tokens,
//   });
// });

// app.get("/robbie", async (req, res) => {
//   const { tokens } = await oauth2Client.getToken(req.query.code);
//   oauth2Client.setCredentials(tokens);

//   // Here, you would typically store the tokens securely and redirect to your front-end
//   res.redirect("/?token=" + tokens.access_token);
// });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
