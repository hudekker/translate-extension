// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { join } = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Import your routes
const readUrlRoute = require('./routes/readUrlRoute');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set 'views' folder
app.set('views', join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to serve the EJS template
app.get('/', (req, res) => {
  res.render('index', { message: 'hello from root' });
});

// Use the read-url route
app.use('/read-url', readUrlRoute);

app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
});
