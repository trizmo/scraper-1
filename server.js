const express = require('express');
const path = require('path');
const logger = require('morgan');
const config = require('./config/config');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');


// IMPORTING SCRAPING TOOLS
const cheerio = require("cheerio");
const axios = require("axios");

// INIT EXPRESS:
const app = express();

// LOGGER FOR DEBUGGING
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SETTING STATIC / PUBLIC PAGES
app.use(express.static("public"));

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// SETTING ROUTER
require('./routes')(app)

// MONGOOSE CONNECTION
mongoose.connect(config.url, { useNewUrlParser: true } )
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error: '))
db.once('open', () => { console.log("Mongoose Connection Successful!")});

//STARTING SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});