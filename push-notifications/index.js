'use strict';

require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const webPush = require('web-push');


/**
 * Set API key
 */
webPush.setVapidDetails(
  'mailto:hallo@justmarkup.com',
  process.env.VAPID_PUBLIC_KEY, 
  process.env.VAPID_PRIVATE_KEY
);

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const pushController = require('./controllers/push');

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', () => {
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

/**
 * Express configuration.
 */
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use("/", express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.post('/push/subscribe', pushController.subscribe);
app.post('/push/unsubscribe', pushController.unsubscribe);

app.listen(process.env.PORT || 3000);
