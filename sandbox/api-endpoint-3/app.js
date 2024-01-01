const express = require('express');
const app = express();
const port = 3000;

// Sample folder data
const folders = [
  { id: '1', name: 'Folder 1', parent: null, children: ['2', '3'] },
  { id: '2', name: 'Subfolder 1.1', parent: '1', children: ['6','7'] },
  { id: '3', name: 'Subfolder 1.2', parent: '1', children: ['4','5'] },
  { id: '4', name: 'Subfolder 1.2.1', parent: '3', children: [] },
  { id: '5', name: 'Subfolder 1.2.2', parent: '3', children: [] },
  { id: '6', name: 'Subfolder 1.1.1', parent: '2', children: [] },
  { id: '7', name: 'Subfolder 1.1.2', parent: '2', children: [] },
];

// Function to get folders by parent ID
function getFoldersByParent(parentId) {
  console.log(`Searching for folders with parentId: ${parentId}`); // Debugging log
  
  // Handle root folders (parentId is null)
  if (parentId === 'null') {
    const rootFolders = folders.filter(folder => folder.parent === null);
    console.log('Root folders:', rootFolders); // Debugging log
    return rootFolders;
  }
  
  const myFolders = folders.filter(folder => folder.parent === parentId);
  console.log('Filtered folders:', myFolders); // Debugging log
  return myFolders;
}

const item = {
  id: 'folder_id',
  name: 'Folder Name',
  parent: 'parent_folder_id', // null for root folders
  children: [] // array of child folder objects
}

// Set the 'views' directory
app.set('views', './views');

// Set the view engine to use (e.g., EJS, Pug, Handlebars)
// For plain HTML files, you can use a template engine like EJS and render them directly
app.set('view engine', 'ejs'); // For example, using EJS as the template engine

// Serve static files (for frontend)
app.use(express.static('public'));


// Render 'index.ejs' from the 'views' directory
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Express route to serve folder data
app.get('/folders', (req, res) => {
  const parentId = req.query.parent || null;
  debugger;
  const data = getFoldersByParent(parentId);
  res.json(data);
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
