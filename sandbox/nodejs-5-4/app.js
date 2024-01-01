import { authenticateAndTokenize } from "./helper/helper-authenticate.js";
import { getTree } from "./helper/helper-tree.js";
import { listEvents } from "./helper/helper-calendar.js";
import { config } from "dotenv";
import { google } from "googleapis";
import fs from "fs";

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
  // 'https://www.googleapis.com/auth/drive.metadata.readonly',
  // Add other scopes as needed
];

(async () => {
  const credentials = {
    installed: {
      redirect_uris: redirectUris,
      client_id: clientId,
      client_secret: clientSecret,
      project_id: projectId,
    },
  };

  try {
    const { client, tokens } = await authenticateAndTokenize(
      credentials,
      scopes
    );

    debugger;

    try {
      fs.writeFileSync("tokens", JSON.stringify(tokens, null, 2));
      console.log("Tokens have been written to tokens.json");
    } catch (error) {
      console.error("Error writing tokens:", error);
    }

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
    //   'summary': '11 Google I/O 2015',
    //   'location': '800 Howard St., San Francisco, CA 94103',
    //   'description': 'A chance to hear more about Google\'s developer products.',
    //   'start': {
    //     'dateTime': '2023-12-17T09:00:00+08:00',
    //     'timeZone': 'Asia/Taipei',
    //   },
    //   'end': {
    //     'dateTime': '2023-12-17T17:00:00+08:00',
    //     'timeZone': 'Asia/Taipei',
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

    // calendar.events.insert({
    //   auth: client,
    //   calendarId: 'primary',
    //   resource: event,
    // }, function (err, event) {
    //   if (err) {
    //     console.log('There was an error contacting the Calendar service: ' + err);
    //     return;
    //   }
    //   debugger;
    //   console.log('Event created: %s', event.data.htmlLink);
    // });

    // debugger;

    // const sheets = google.sheets({
    //   version: 'v4',
    //   auth: client
    // });

    // const res = await sheets.spreadsheets.values.get({
    //   spreadsheetId: '1LdKIcGnsYOjSvw3UnaUVDVqbD3wwKfd9ouijYQZewBI',
    //   range: 'Sheet1!A1:B2',
    // });

    // const rows = res.data.values;
    // if (!rows || rows.length === 0) {
    //   console.log('No data found.');
    //   return;
    // }
    // console.log('Name, Major:');
    // rows.forEach((row) => {
    //   // Print columns A and E, which correspond to indices 0 and 4.
    //   console.log(`${row[0]}, ${row[4]}`);
    // });

    const apis = google.getSupportedAPIs();
    debugger;

    // console.log('done!');
    // await listEvents(calendar);

    // console.log(`tokens`);
    // console.log(tokens);

    // let fileId = '1wJyjvY_ADqnoUAxjmkx_GmH0b-J0QB3H'
    // const fileMetadata = await gdrive.files.get({ fileId });
    // console.log(fileMetadata);

    // Fetch the folder metadata with the specified fields
    let folderId = "1PpXJHsF9hWcQbi2KQOvmAg94ZteqiCr6";
    // const fields = "id,name,mimeType,children(id,name,mimeType)";
    let fields =
      "kind, driveId, fileExtension, copyRequiresWriterPermission, md5Checksum, contentHints(indexableText, thumbnail), writersCanShare, viewedByMe, mimeType, exportLinks, parents, thumbnailLink, iconLink, shared, lastModifyingUser, owners, headRevisionId, sharingUser, webViewLink, webContentLink, size, viewersCanCopyContent, permissions, hasThumbnail, spaces, folderColorRgb, id, name, description, starred, trashed, explicitlyTrashed, createdTime, modifiedTime, modifiedByMeTime, viewedByMeTime, sharedWithMeTime, quotaBytesUsed, version, originalFilename, ownedByMe, fullFileExtension, properties, appProperties, isAppAuthorized, teamDriveId, capabilities, hasAugmentedPermissions, trashingUser, thumbnailVersion, trashedTime, modifiedByMe, permissionIds, imageMediaMetadata, videoMediaMetadata, shortcutDetails, contentRestrictions, resourceKey, linkShareMetadata, labelInfo, sha1Checksum, sha256Checksum";

    const myData = await gdrive.files.get({
      fileId: folderId,
      fields: fields,
    });

    debugger;

    const pageSize = 10; // Number of files to retrieve per page
    let nextPageToken = null;

    const listFiles = async () => {
      const params = {
        pageSize,
        pageToken: nextPageToken,
        fields: "nextPageToken, files(id, name)", // Specify the fields you want to retrieve
      };

      try {
        const response = await gdrive.files.list(params);
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

    // Get the folder tree
    // let tree = await getTree(gdrive);
    // console.table(tree);
  } catch (error) {
    console.error("Error:", error);
  }
})();
