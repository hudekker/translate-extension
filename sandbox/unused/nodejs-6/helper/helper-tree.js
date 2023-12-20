let foldersraw = [];

async function getFolderTree(drive, folderId, depth = 1, pageToken = null) {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false and mimeType='application/vnd.google-apps.folder'`,
      pageToken: pageToken,
    });

    const files = response.data.files;

    if (files && files.length > 0) {
      // Use Promise.all for parallelization
      await Promise.all(files.map(async (file) => {
        if (file.mimeType === 'application/vnd.google-apps.folder') {
          const indentation = (depth, item) => {
            item = ' '.repeat((depth - 1) * 1) + item;
            return item + ' '.repeat(30 - item.length);
          }

          foldersraw.push({
            id: file.id,
            name: file.name,
            parentId: folderId || null,
          });
          await getFolderTree(drive, file.id, depth + 1);
          // }
        }
        return null;
      }));
    }

    // Check if there are more results (pagination)
    const nextPageToken = response.data.nextPageToken;
    if (nextPageToken) {
      // Recursively fetch the next page
      await getFolderTree(drive, folderId, depth, nextPageToken);
    }
  } catch (error) {
    console.error('Error retrieving folder tree:', error.message);
  }
}

// Example logic to reconstruct the tree from foldersraw array
function reconstructTree(foldersraw) {
  let tree = [];

  foldersraw.forEach(folder => {
    if (folder.parentId === 'root') {
      folder.depth = 1;
      folder.parentName = 'root';
      tree.push(folder);
    } else {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].id === folder.parentId) {
          folder.depth = tree[i].depth + 1;
          folder.parentName = tree[i].name;
          tree.splice(i + 1, 0, folder);
          break;
        }
      }
    }
  });

  return tree;
}

// Main function to run the example
async function getTree(drive) {
  try {

    await getFolderTree(drive, 'root');

    // Process the foldersraw array to reconstruct the tree
    const tree = reconstructTree(foldersraw);

    let tree2 = tree.map(({ name, id, ...rest }) => {
      return { folderName: name, folderId: id, ...rest };
    });

    tree2 = tree2.map(({ folderName, folderId, depth, parentId, parentName }) => ({ depth, folderName, folderId, parentName, parentId }));

    debugger;
    return tree2;
  } catch (error) {
    console.error('Error in main function:', error.message);
  }
}

module.exports = {
  getTree
};