// Copyright 2016 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const path = require('path');
const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');

const drive = google.drive('v3');

async function runSample(query) {
  // Obtain user credentials to use for the request
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, 'oauth2.keys.json'),
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  google.options({ auth });

  const params = {
    pageSize: 20,
  };

  params.q = query;

  const params2 = {
    pageSize: 100,
    fields: 'files(kind, driveId, fileExtension, copyRequiresWriterPermission, md5Checksum, contentHints(indexableText, thumbnail), writersCanShare, viewedByMe, mimeType, exportLinks, parents, thumbnailLink, iconLink, shared, lastModifyingUser, owners, headRevisionId, sharingUser, webViewLink, webContentLink, size, viewersCanCopyContent, permissions, hasThumbnail, spaces, folderColorRgb, id, name, description, starred, trashed, explicitlyTrashed, createdTime, modifiedTime, modifiedByMeTime, viewedByMeTime, sharedWithMeTime, quotaBytesUsed, version, originalFilename, ownedByMe, fullFileExtension, properties, appProperties, isAppAuthorized, teamDriveId, capabilities, hasAugmentedPermissions, trashingUser, thumbnailVersion, trashedTime, modifiedByMe, permissionIds, imageMediaMetadata, videoMediaMetadata, shortcutDetails, contentRestrictions, resourceKey, linkShareMetadata, labelInfo, sha1Checksum, sha256Checksum)',
  }

  // const params3 = {
  //   q: '1FkGGs_ymjiPuOIVVG0E4N8vfUJQnQg9U in parents',
  //   pageSize: 100,
  //   fields: 'files(name, id, kind, mimeType, parents)'
  // }


  const fileId = '1-0V9XZPHswZvIxW0Rbu-w4zB-HaXpONv';
  let name2 = '宣教心視野';
  const params3 = {
    // q: `name=\'${name2}\'`,
    // q: `name=\'宣教心視野\'`,
    // q: `fileId=\'${fileId}\'`,
    // q: `fileId=\'1-0V9XZPHswZvIxW0Rbu-w4zB-HaXpONv\'`,
    // q: `\'0ALjr6XgR3hxbUk9PVA\' in parents`,
    // q: `\'1i0PKWRbY3jFuXyZNJgZM1IujIceK7wMR\' in parents`,
    q: '\'1-0V9XZPHswZvIxW0Rbu-w4zB-HaXpONv\' in fileId',
    pageSize: 100,
    // fields: 'files(kind, driveId, fileExtension, copyRequiresWriterPermission, md5Checksum, contentHints(indexableText, thumbnail), writersCanShare, viewedByMe, mimeType, exportLinks, parents, thumbnailLink, iconLink, shared, lastModifyingUser, owners, headRevisionId, sharingUser, webViewLink, webContentLink, size, viewersCanCopyContent, permissions, hasThumbnail, spaces, folderColorRgb, id, name, description, starred, trashed, explicitlyTrashed, createdTime, modifiedTime, modifiedByMeTime, viewedByMeTime, sharedWithMeTime, quotaBytesUsed, version, originalFilename, ownedByMe, fullFileExtension, properties, appProperties, isAppAuthorized, teamDriveId, capabilities, hasAugmentedPermissions, trashingUser, thumbnailVersion, trashedTime, modifiedByMe, permissionIds, imageMediaMetadata, videoMediaMetadata, shortcutDetails, contentRestrictions, resourceKey, linkShareMetadata, labelInfo, sha1Checksum, sha256Checksum)',
    fields: 'files(name, id, kind, mimeType, parents)'
  };

  // params3.q = '1FkGGs_ymjiPuOIVVG0E4N8vfUJQnQg9U in parents'

  const res = await drive.files.list(params3);
  debugger;
  // console.log(res.data);
  let listing = res.data.files

  debugger;

  listing = listing.filter(el => { if (el.parents) return true })

  function filterFilesByMultipleParents(files) {
    let filteredFile = files.filter(file => {
      if (file && file.parents) {
        const parentsArray = file.parents ? JSON.parse(file.parents) : [];
        return Array.isArray(parentsArray) && parentsArray.length > 1;
      }
    });

    debugger;

    return filteredFile;
  }

  const updatedFiles = listing.map(file => {
    const updatedFile = {
      ...file,
      parents: JSON.stringify(file.parents),
    };

    if (updatedFile.imageMediaMetadata && typeof updatedFile.imageMediaMetadata.location === 'object') {
      updatedFile.imageMediaMetadata.location = JSON.stringify(updatedFile.imageMediaMetadata.location);
    }

    return updatedFile;
  });


  const filteredFiles = filterFilesByMultipleParents(updatedFiles);
  // console.log(filteredFiles);
  // const updatedFiles = listing.map(file => ({
  //   ...file,
  //   parents: JSON.stringify(file.parents),
  // }));

  console.log(updatedFiles);


  return res.data;
}

if (module === require.main) {
  runSample().catch(console.error);
}
module.exports = runSample;