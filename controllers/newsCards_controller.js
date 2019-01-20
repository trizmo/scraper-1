const cheerio = require("cheerio");
const request = require('request');
var db = require("../models");
const url = 'http://www.rarecarsforsaleblog.com/';
const config = require('../config/config');
const mongoose = require('mongoose');
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

// NOT USING THIS
// findOne function pulls the article when clicked on. Similar to the one being used to add comment
exports.getOne = function (req, res) {
  console.log("req.params.id: ")
  console.log(req.params.id)
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
}


// findOneAndUpdate will find the article that we want to add the comment to. 
// It will save the last comment with the article and display that, 
// while keeping a history of all comments in Note collection
exports.addComment = function (req, res) {
  console.log("req.body: ")
  console.log(req.body)
  db.Note.create(req.body)
    .then(function(dbNote) {
      console.log("dbNote: ")
      console.log(dbNote)
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id, comment2: dbNote.comment }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
      // res.redirect('');
    })
    .catch(function (err) {
      res.json(err);
    });
}



