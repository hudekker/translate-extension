const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const { join } = require('path');
const app = express();
const port = process.env.PORT || 3000;
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// dotenv
// Dev and Prod handled differently in .env for baseUrl
require("dotenv").config({ path: join(__dirname, "./.env") });
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Missing CLIENT_ID or CLIENT_SECRET in environmental variables');
  process.exit(1);
}

// Dev and Prod handled differently in .env for baseUrl
const baseURL = process.env.NODE_ENV === 'production'
  ? process.env.PROD_BASE_URL
  : process.env.DEV_BASE_URL;

// Create oath2
const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  `${baseURL}/auth/google/callback`
);
// Approved credentials
const approvedEmails = ['ntnurobert@gmail.com', 'hudektech@gmail.com', 'hudekker@gmail.com'];
const readUrlRoute = require('./routes/readUrlRoute.js');

//Initialize passport
app.use(passport.initialize());

// First middleware
app.use(session({
  secret: clientSecret,
  resave: true,
  saveUninitialized: true
}));

// Use passport session
app.use(passport.session());

// Configuration
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('index', { message: 'hi' });
  } else {
    res.redirect('/login');
    // res.redirect('/auth/google');
  }
});

// Routes
app.use('/read-url', readUrlRoute);

app.get('/dashboard', (req, res) => {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    res.render('dashboard', { user: req.user });
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

passport.use(new GoogleStrategy({
  clientID: clientId,
  clientSecret: clientSecret,
  callbackURL: `${baseURL}/auth/google/callback`,
},
  (accessToken, refreshToken, profile, done) => {
    // Check if the email is approved
    const userEmail = profile._json.email;
    if (approvedEmails.includes(userEmail)) {
      return done(null, profile);
    } else {
      return done(null, false, { message: 'Unauthorized user' });
    }
  }));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const handleGoogleAuthError = (err, req, res, next) => {
  if (err) {
    console.error(err);
    return res.redirect('/');
  }
  if (!req.user) {
    return res.redirect('/'); // or handle unauthorized user case
  }
  return res.redirect('/dashboard');
};

app.get('/login', (req, res, next) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email'],
    prompt: 'select_account', // Add this line for Account Chooser
  });

  res.redirect(authUrl);
});



// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email'] }),
//   (req, res, next) => {
//     passport.authenticate('google', handleGoogleAuthError)(req, res, next);
//   });

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/unauthorized' }),
  (req, res) => {
    res.redirect('/'); // Redirect to your dashboard or main page
  });

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Route for unauthorized access
app.get('/unauthorized', (req, res) => {
  res.render('unauthorized');
});

///////////////////////////////////////////////////
// Configure Multer for handling file uploads
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Handle POST request for image upload
app.post('/upload-image', upload.single('image'), (req, res) => {
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl });
});
////////////////////////////////////////////////////

// Start the server
app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
}).on('error', (err) => {
  console.error(`Error starting server: ${err.message}`);
});
