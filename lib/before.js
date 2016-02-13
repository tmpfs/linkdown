var path = require('path')
  , ttycolor = require('ttycolor')
  , ansi = ttycolor.ansi
  , merge = require('merge')
  , Crawler = require('simplecrawler');

function getCrawler(url) {
  var crawler = Crawler.crawl(url)
    , conf = require('../linkdown.js')
    , crawl
    , i
    , file
    , mod
    , k
    , v
    , cliconf = this.conf;

  // load and merge configuration files from the command line
  for(i = 0;i < cliconf.length;i++) {
    file = path.normalize(path.join(process.cwd(), cliconf[i]));
    try {
      mod = require(file);
      conf = merge.recursive(true, conf, mod);
    }catch(e) {
      this.raise(this.errors.ECONF_LOAD, [file]);
    }
  }

  // assign to the crawler
  crawl = conf.crawl;

  // reference so commands can access
  // the final configuration
  this.configuration = conf;

  for(k in crawl) {
    if(crawler.hasOwnProperty(k)) {
      v = crawler[k];
      crawler[k] = crawl[k];
      this.log.debug(
        'set %s=%s (old: %s, new: %s)', k, crawl[k], v, crawler[k]);
    } 
  }

  if(this.follow !== false) {
    crawler.on('fetchredirect', function(item, url) {
      crawler.queue.add(url.protocol, url.host, url.port, url.path);
    })
  }

  // override with command line args
  if(this.depth) {
    crawler.maxDepth = parseInt(this.depth);
  }

  return crawler;
}

/**
 *  Print a crawl fetch response.
 */
function print(state) {
  var status = state.item.stateData.code
    , success = /^(2|3)/.test('' + status)
    , stream = process.stdout
    , tty;

  if(!success) {
    stream = process.stdout; 
  }

  tty = state.req.tty(stream);

  this.log.info(
    '%s %s' + (state.buffer ? ' (%s bytes)' : ''),
    ansi(status)[success ? 'green' : 'red' ].valueOf(tty),
    state.item.url,
    state.buffer ? ansi('' + state.buffer.length).bright.valueOf(tty) : '');
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
  req.print = print.bind(this);

  this.getCrawler = getCrawler.bind(this);

  //info.args = info.args.concat(req.patterns);
  next();
}

module.exports = before;
