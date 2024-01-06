import { authenticateAndTokenize } from "./helper/helper-authenticate.js";
import { getTree } from "./helper/helper-tree.js";
import { listEvents } from "./helper/helper-calendar.js";
import { config } from "dotenv";
import { google } from "googleapis";
import { GoogleSpreadsheet } from "google-spreadsheet";
// import { JWT } from "google-auth-library";

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication

// const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

// Extract values from environment variables

(async () => {
  config();

  try {
    const redirectUris = process.env.REDIRECT_URIS;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const projectId = process.env.PROJECT_ID;
    const scopes = [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/calendar",
      // 'https://www.googleapis.com/auth/drive.metadata.readonly',
      // Add other scopes as needed
    ];

    const credentials = {
      installed: {
        redirect_uris: redirectUris,
        client_id: clientId,
        client_secret: clientSecret,
        project_id: projectId,
      },
    };

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    debugger;

    const doc = new GoogleSpreadsheet(
      "<the sheet ID from the url>",
      serviceAccountAuth
    );

    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);
    await doc.updateProperties({ title: "renamed doc" });

    const { client, tokens } = await authenticateAndTokenize(
      credentials,
      scopes
    );

    // Initialize Google Drive client
    const gdrive = google.drive({
      version: "v3",
      auth: client,
    });

    // Initialize Google Calendar client
    const calendar = google.calendar({
      version: "v3",
      auth: client, // Assuming 'client' is your authorized OAuth2 client
    });

    // const event = {
    //   'summary': 'Google I/O 2015',
    //   'location': '800 Howard St., San Francisco, CA 94103',
    //   'description': 'A chance to hear more about Google\'s developer products.',
    //   'start': {
    //     'dateTime': '2023-12-28T09:00:00-07:00',
    //     'timeZone': 'America/Los_Angeles',
    //   },
    //   'end': {
    //     'dateTime': '2023-12-28T17:00:00-07:00',
    //     'timeZone': 'America/Los_Angeles',
    //   },
    //   'recurrence': [
    //     'RRULE:FREQ=DAILY;COUNT=2'
    //   ],
    //   'attendees': [
    //     { 'email': 'lpage@example.com' },
    //     { 'email': 'sbrin@example.com' },
    //   ],
    //   'reminders': {
    //     'useDefault': false,
    //     'overrides': [
    //       { 'method': 'email', 'minutes': 24 * 60 },
    //       { 'method': 'popup', 'minutes': 10 },
    //     ],
    //   },
    // };
    // debugger;

    // calendar.events.insert({
    //   auth: auth,
    //   calendarId: 'primary',
    //   resource: event,
    // }, function (err, event) {
    //   if (err) {
    //     console.log('There was an error contacting the Calendar service: ' + err);
    //     return;
    //   }
    //   console.log('Event created: %s', event.htmlLink);
    // });

    const apis = google.getSupportedAPIs();

    // console.log('done!');
    // await listEvents(calendar);

    // console.log(`tokens`);
    // console.log(tokens);

    // let fileId = "1wJyjvY_ADqnoUAxjmkx_GmH0b-J0QB3H";
    // const fileMetadata = await gdrive.files.get({ fileId });
    // // const fileMetadata = await gdrive.files.get({ fileId });
    // console.log(fileMetadata);

    // Replace 'folderId' with the ID of the folder you want to retrieve

    // Define the fields to include in the API response

    // Fetch the folder metadata with the specified fields
    // let folderId = "1wJyjvY_ADqnoUAxjmkx_GmH0b-J0QB3H";
    // const fields = "id,name,mimeType,children(id,name,mimeType)";
    // const myData = await gdrive.files.get({
    //   fileId: folderId,
    //   fields: fields,
    // });

    // Get the folder tree
    let tree = await getTree(gdrive);
    console.table(tree);
  } catch (error) {
    console.error("Error:", error);
  }
})();
