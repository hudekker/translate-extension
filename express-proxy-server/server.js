const express = require('express');
const rp = require('request-promise-native');

const app = express();
const PROXY_PORT = process.env.PORT || 3500;
const PROXY_PASSWORD = process.env.PROXY_PASSWORD || 'yu-guang-dao';


// Middleware to handle CORS headers
app.options('/proxy/:url', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, Custom-Header');
  res.status(200).send();
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(function (req, res, next) {
  const providedPassword = req.headers.authorization;
  debugger;

  // if (true) {
  if (providedPassword === PROXY_PASSWORD) {
    res.header('Access-Control-Allow-Headers', 'Authorization'); // Allow 'Authorization' header

    next();
  } else {
    // Incorrect or missing password, return unauthorized
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Route to proxy the external request
app.get('/proxy/:url', async function (req, res) {
  try {
    const externalUrl = decodeURIComponent(req.params.url);
    const externalData = await rp({ uri: externalUrl, json: true });
    res.json(externalData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(PROXY_PORT, function () {
  console.log('Proxy is running on http://localhost:' + PROXY_PORT);
});
