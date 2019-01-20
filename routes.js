module.exports = function(app) {

  var newsCards = require('./routes/newsCards');
  app.use('/', newsCards)
  app.use('/articles', newsCards)

}