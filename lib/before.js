var util = require('util')
  , ttycolor = require('ttycolor')
  , Crawler = require('simplecrawler')
  , ansi = ttycolor.ansi
  , EOL = require('os').EOL
  , SPACE = ' ';

function getCrawler(url) {
  var crawler = Crawler.crawl(url);

  crawler.downloadUnsupported = false;
  crawler.userAgent = 'Linkdown';
  crawler.interval = 200;
  crawler.maxConcurrency = 25;

  if(this.depth) {
    crawler.maxDepth = parseInt(this.depth);
  }

  return crawler;
}

/**
 *  Print a crawl fetch response.
 */
function printResponse(state) {
  var status = state.item.stateData.code
    , success = /^(2|3)/.test('' + status)
    , stream = process.stdout
    , tty;

  if(!success) {
    stream = process.stdout; 
  }

  tty = state.req.tty(stream);

  /* istanbul ignore next: want silent in tests */
  if(!this.silent) {
    // status code
    stream.write(
      ansi(status + SPACE)[success ? 'green' : 'red' ].valueOf(tty));

    // request url
    stream.write(state.item.url);

    // response size
    if(state.buffer) {
      stream.write(
        util.format(
          ' (%s bytes)',
          ansi('' + state.buffer.length).bright.valueOf(tty)));
    }
    stream.write(EOL);
  }
}

/**
 *  Determine if a stream is a TTY or whether colors should be used.
 */
function tty(stream) {
  /* istanbul ignore next: no colors in tests */
  if(this.color === false) {
    return false; 
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

  // print fetch response
  req.printResponse = printResponse.bind(this);

  this.getCrawler = getCrawler.bind(this);

  //info.args = info.args.concat(req.patterns);
  next();
}

module.exports = before;
