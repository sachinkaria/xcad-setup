'use strict';

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./server/config/main');
const chokidar = require('chokidar');
const authRoutes = require('./server/routes/user');
// and create our instances
const app = express();
const router = express.Router();

const watcher = chokidar.watch('./client');


// clear server cache and reload frontend files
watcher.on('ready', () => {
  watcher.on('all', () => {
    console.log('Clearing /client/ module cache from server');
    Object.keys(require.cache).forEach(id => {
      if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id];
    });
  });
});

// now we should configure the API to use bodyParser and look for
// JSON data in the request body
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(bodyParser.json({ limit: '30mb' }));

// To prevent errors from Cross Origin Resource Sharing, we will set
// our headers to allow CORS with middleware like so:
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers');

  // and remove cacheing so we get the most recent data
  res.setHeader('Cache-Control', 'no-cache');
  
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

authRoutes(router);

// Use our router configuration when we call /
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'), router);
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  app.use('/', router);
}

// starts the server and listens for requests
app.listen(config.port, () => {
  console.log(`api running on port ${config.port}`);
});

// db config
mongoose.connect(config.database, {
  useMongoClient: true,
});
