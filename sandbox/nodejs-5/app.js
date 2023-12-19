import { authenticate } from './helper/helper-authenticate.js';
import { getTree } from './helper/helper-tree.js';
import { config } from 'dotenv';
config();

// const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

// Extract values from environment variables
const redirectUris = process.env.REDIRECT_URIS;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const projectId = process.env.PROJECT_ID;


(async () => {
  const scopes = [
    'https://www.googleapis.com/auth/drive',
    // 'https://www.googleapis.com/auth/drive.metadata.readonly',
    // Add other scopes as needed
  ];

  const credentials = {
    "installed": {
      "redirect_uris": redirectUris,
      "client_id": clientId,
      "client_secret": clientSecret,
      "project_id": projectId
    }
  }

  try {
    const gdrive = await authenticate({ keyFileData: credentials, scopes: scopes });

    // let fileId = '1vLryki2mLmNnk4LtzcaCw7-sC-cJ4jtS'
    // const fileMetadata = await gdrive.files.get({ fileId });
    // console.log(fileMetadata);

    // Get the folder tree
    let tree = await getTree(gdrive);
    console.table(tree)

  } catch (error) {
    console.error('Error:', error);
  }
})();