var path = require('path')
  , express = require('express')
  , zlib = require('zlib')
  , app = express()
  , wildcard = require('./wildcard')
  , errorView = require('./error-view');

app.disable('x-powered-by');
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/view'));
app.use(express.static(path.join(__dirname, '/public')));

// pretty print html so that grep example
// searches do not print the entire document
app.locals.pretty = true;

// VALID STATIC ROUTES (SITEMAP)

/**
 *  Get the index page.
 */
app.get('/', function(req, res) {
  res.render('index');
});

/**
 *  Gzip encoding.
 */
app.get('/gzip', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.set('Content-Encoding', 'gzip');
  var text = "plain text";
  zlib.gzip(text, function (_, result) {
    res.end(result);
  });
});

/**
 *  Text directory.
 */
app.get('/text', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.send('plain text');
});

/**
 *  Mock section.
 */
app.get('/section', function(req, res) {
  res.render('section');
});

/**
 *  Mock deep page.
 */
app.get('/section/page', function(req, res) {
  res.render('page');
});

/**
 *  Mock deep sibling.
 */
app.get('/section/alt', function(req, res) {
  res.render('alt');
});


/**
 *  Page with extended meta data.
 */
app.get('/meta', function(req, res) {
  res.render('meta');
});

/**
 *  Validation warning.
 */
app.get('/validate-warn', function(req, res) {
  res.render('validate-warn', {pretty: false});
});

/**
 *  Validation error.
 */
app.get('/validate-error', function(req, res) {
  res.render('validate-error', {pretty: false});
});

/**
 *  Validation error and warning.
 */
app.get('/validate-fail', function(req, res) {
  res.render('validate-fail', {pretty: false});
  //res.render('validate-fail');
});

/**
 *  Deep page with no parent hierarchy.
 */
app.get('/into/the/deep', function(req, res) {
  res.render('deep');
});

// MOCK ROUTES (NON-SITEMAP)

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

app.all('*', wildcard);
app.use(errorView);

module.exports = app;
