var path = require('path')
  , express = require('express')
  , app = express()
  , wildcard = require('./wildcard')
  , errorView = require('./error-view');

app.disable('x-powered-by');
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/view'));
app.use(express.static(path.join(__dirname, '/public')));

/**
 *  Get the index page.
 */
app.get('/', function(req, res) {
  res.render('index');
});

/**
 *  Redirect to another page.
 */
app.get('/redirect', function(req, res) {
  res.redirect('/');
});


app.all('*', wildcard);
app.use(errorView);

module.exports = app;
