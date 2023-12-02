// routes/exampleRoute.js
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { url } = req.body;
  console.log('URL submitted:', url);
  debugger;
  res.render('index', { message: url });
});

module.exports = router;
