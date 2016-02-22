var http = require('http')
  , port = 9000
  , Crawler = require('simplecrawler');

/**
 *  Test to verify fetch condition follow through.
 */

function request(req, res) {
  var buf;
  if(req.url === '/') {
    buf = new Buffer(
      '<html><body><a href="/page1">page1</a>'
      + '<a href="/page2">page2</a></body></html>');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Length', buf.length);
    res.end(buf);
  }else if(req.url === '/page1') {
    buf = new Buffer(
      '<html><body><a href="/">home</a></body></html>');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Length', buf.length);
    res.end(buf);
  }else if(req.url === '/page2') {
    buf = new Buffer(
      '<html><body><a href="/">home</a></body></html>');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Length', buf.length);
    res.end(buf);
  }
}

var server = http.createServer(request);

server.listen(port, function() {
  //console.log('server on %s', port);
  var host = 'localhost'
    , ptn = /^\/page1/;

  var crawler = new Crawler(host, '/', port);

  crawler.addFetchCondition(function(url) {
    return !ptn.test(url.path);
  })

  crawler.addFetchCondition(function(url) {
    return (host === url.host && port === parseInt(url.port));
  })

  crawler.on('fetchcomplete', function(item/*, buf, res*/) {
    console.log('fetch complete fired %s', item.url); 
  })

  crawler.start();
})
