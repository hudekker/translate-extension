// Stack to maintain parent folder IDs
const parentStack = [];

// Variable to store fetched folders
let allFolders = [];

// Function to fetch folders from server
async function fetchFolders(parentId = null) {
  const response = await fetch(`/folders?parent=${parentId}`);
  const data = await response.json();
  return data;
}

// Function to initialize folders and render the initial view
async function initializeFolders() {
  allFolders = await fetchFolders();
  await renderFolders();
}

// Function to render folders based on current view and parent ID
async function renderFolders(parentId = null) {

  const folderContainer = document.getElementById('folder-container');
  console.log('Existing folderContainer content:', folderContainer.innerHTML); // Log existing content
  
  folderContainer.innerHTML = ''; // Clear previous content
  
  console.log('Clearing folderContainer. Adding new content...');

  const currentFolders = allFolders.filter(el=>el.parent === parentId)
  
  currentFolders.forEach(folder => {
    const folderElement = document.createElement('div');
    // Check if folder.children exists and is an array
    const hasChildren = folder.children && Array.isArray(folder.children) && folder.children.length > 0;
  
    folderElement.className = `folder ${hasChildren ? 'has-children' : 'no-children'}`;

    // Add up and down arrow buttons
    const arrowButtons = document.createElement('div');
    arrowButtons.className = 'arrow-buttons';
    arrowButtons.innerHTML = `
      <button class="arrow up-arrow" onclick="navigateUp('${folder.id}')">&#9650;</button>
      <button class="arrow down-arrow" onclick="navigateDown('${folder.id}')">&#9660;</button>
    `;

    folderElement.appendChild(arrowButtons);

    // Add folder name
    const folderName = document.createElement('span');
    folderName.textContent = folder.name;
    folderElement.appendChild(folderName);

    folderElement.addEventListener('click', async () => {
      if (folder.children.length === 0) {
        // Display a message popup for bottom folder
        alert('This is the bottom of the tree.');
      } else {
        // Push the current folder ID to the stack before navigating

        parentStack.push(folder);
        // Render folders based on the current view and folderId
        await renderFolders(folder.id);
      }
    });

    folderContainer.appendChild(folderElement);
    console.log('Updated folderContainer content:', folderContainer.innerHTML); // Log updated content

  });
}

// Function to get current folders based on parentStack
function getCurrentFolders() {
  let current = allFolders;
  for (const {parentId} of parentStack) {
    const folder = current.find(f => f.id === parentId);
    if (folder && folder.children) {
      current = folder.children;
    } else {
      return [];
    }
  }
  return current;
}

// Function to navigate up the tree
async function navigateUp(folderId) {
  await renderFolders(folderId);

}

// Function to navigate down the tree
async function navigateDown(folderId) {
  // Find the folder object by ID
  const folder = allFolders.find(f => f.id === folderId);
  if (folder) {
    // Check if child folders are available in the allFolders array
    const childFolders = allFolders.filter(f => f.parent === folder.id);
    if (childFolders.length > 0) {
      // Render child folders directly from the allFolders array
      await renderFolders(folder.id);
    } else {
      // Fetch child folders from the server by querying with the current folder's ID as the parent ID
      await fetchAndRenderChildFolders(folder.id);
    }
  }
}

// Function to fetch child folders from the server by querying with the parent ID
async function fetchAndRenderChildFolders(parentId) {
  const childFolders = await fetchFolders(parentId);
  // Update the allFolders array with the fetched child folders
  allFolders.push(...childFolders);
  // Render child folders
  await renderFolders(parentId);
}


// Initialize folders and render the initial view
initializeFolders();
