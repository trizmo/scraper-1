const cheerio = require("cheerio");
const request = require('request');
// const Article = require('../models/Article')
// const Note = require('../models/Note')
var db = require("../models");
const url = 'http://www.rarecarsforsaleblog.com/';
const config = require('../config/config');
const mongoose = require('mongoose');
// const db = mongoose.connection;
mongoose.connect(config.url, { useNewUrlParser: true })

exports.index = function (err, res) {
  db.Article.find({}, function (err, dbArticle) {
    console.log("finding articles")
    console.log(dbArticle)
    res.render('newsCards/newsCards', {
      layout: 'main',
      article: dbArticle
    });
  })
    .catch(function (err) {
      console.log("error finding articles")
      // If an error occurred, send it to the client
      res.json(err);
    });
};

exports.scrape = function (req, res) {
  console.log("SCRAPING COMMENCED...");
  request(url, function (err, res, body) {
    const $ = cheerio.load(body);
    const postTitles = []
    $(".post-title").each(function (i, element) {
      const $element = $(element);
      const title = $element.text().trim();
      const postTitle = {
        title: title
      }
      postTitles.push(postTitle);
    });
    // console.log("Displaying postTitles: ")
    // console.log(postTitles)
    db.Article.create(postTitles)
      .then(function (dbArticle) {
        // console.log(dbArticle);
      })
      .catch(function (err) {
        console.log(err);
      });

  })
  res.send("scrape complete.")
};

exports.getOne = function (req, res) {
  console.log("req.params.id: ")
  console.log(req.params.id)
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })

    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
}


// Route for saving/updating an Article's associated Note
// Create a new note and pass the req.body to the entry

exports.addComment = function (req, res) {
  console.log("req.body: ")
  console.log(req.body)
  db.Note.create(req.body)

    .then(function(dbNote) {
      console.log("dbNote: ")
      console.log(dbNote)
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id, comment2: dbNote.comment }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
      // res.redirect('');
      
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
}



