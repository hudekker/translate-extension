const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const { join } = require('path');
const app = express();
const port = process.env.PORT || 3000;
// const translateRoute = require('./routes/translateRoute.js');
const readUrlRoute = require('./routes/readUrlRoute.js');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set 'views' folder
app.set('views', join(__dirname, 'views'));

// Endpoint to serve the EJS template
app.get('/', (req, res) => {
  res.render('index');
});

// Use the translate and scrape routes
// app.use('/translate', translateRoute);
app.use('/read-url', readUrlRoute);

app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
});
