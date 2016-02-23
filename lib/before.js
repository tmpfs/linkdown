var print = require('./print')
  , headers = require('./headers')
  , crawler = require('./crawler');

/**
 *  Determine if a stream is a TTY or whether colors should be used.
 */
function tty(stream) {

  /* istanbul ignore next: no colors in tests */
  if(this.color === false) {
    return false; 
  // force colors
  }else if(this.color === true) {
    return true; 
  }

  /* istanbul ignore next: shouldn't get this far in tests */
  return stream.isTTY;
}

/**
 *  Decorate request before commands are executed.
 */
function before(info, req, next) {

  // utility functions on req
  req.tty = tty.bind(this);

  // print fetchheaders
  this.headers = headers.bind(this);

  // print fetchcomplete
  this.print = print.bind(this);

  // get a new crawler
  this.crawler = crawler.bind(this);

  next();
}

module.exports = before;
