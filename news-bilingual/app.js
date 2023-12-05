const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const { join } = require('path');
const app = express();

// Configuration
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

// Endpoint to serve the EJS template
app.get('/', (req, res) => {
  res.render('index', { message: 'hi' });
});

// Routes
const readUrlRoute = require('./routes/readUrlRoute.js');
app.use('/read-url', readUrlRoute);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
}).on('error', (err) => {
  console.error(`Error starting server: ${err.message}`);
});
