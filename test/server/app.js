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

/**
 *  Bad content length header.
 */
app.get('/bad-length', function(req, res) {
  res.set('Content-Length', '4')
  res.end('<html></html>');
});

/**
 *  Validation warning.
 */
app.get('/validate-warn', function(req, res) {
  res.render('validate-warn');
});

/**
 *  Validation error.
 */
app.get('/validate-error', function(req, res) {
  res.render('validate-error');
});

/**
 *  Validation error and warning.
 */
app.get('/validate-fail', function(req, res) {
  res.render('validate-fail');
});

app.all('*', wildcard);
app.use(errorView);

module.exports = app;
