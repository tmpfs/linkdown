var http = require('http')
  , port = 9000
  , Crawler = require('simplecrawler');

/**
 *  Test to verify automatically following redirects.
 */

function request(req, res) {
  //console.log(req.url);

  var buf;
  if(req.url === '/') {
    buf = new Buffer(
      '<html><body><a href="/redirect">link</a></body></html>');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Length', buf.length);
    res.end(buf);
  }else if(req.url === '/redirect') {
    res.writeHead(301, {'Location': '/page'})
    res.end();
  }else if(req.url === '/page') {
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

  var crawler = new Crawler('localhost', '/', port);

  crawler.on('fetchcomplete', function(item/*, buf, res*/) {
    console.log('fetch complete fired %s', item.url); 
  })

  crawler.start();

})
