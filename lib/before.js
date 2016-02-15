var path = require('path')
  , uri = require('url')
  , ttycolor = require('ttycolor')
  , ansi = ttycolor.ansi
  , merge = require('merge')
  , defaultStyles = require('./styles/defaults')
  , responseStyles = require('./styles/response')
  , Crawler = require('simplecrawler');

function getCrawler(url) {
  var u = uri.parse(url)
    , crawler = new Crawler(
      u.hostname, u.pathname, u.port ? parseInt(u.port) : null)
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

  function onQueueAdd(item) {
    this.log.trace('queue add %s', item.url)
  }

  crawler.on('queueadd', onQueueAdd.bind(this));

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

  // change output styles for repsonse messages
  ttycolor.styles(responseStyles);

  var status = state.item.stateData.code
    , success = /^(2|3)/.test('' + status)
    , clientError = /^(4)/.test('' + status)
    , serverError = /^(5)/.test('' + status)
    , stream = process.stderr
    , tty;

  tty = state.req.tty(stream);

  var method = 'info';

  if(clientError) {
    method = 'warn';
  }else if(serverError) {
    method = 'error';
  }

  this.log[method](
    '%s %s' + (state.buffer ? ' (%s bytes)' : ''),
    ansi(status)[success ? 'green' : 'red' ].valueOf(tty),
    state.item.url,
    state.buffer ? ansi('' + state.buffer.length).bright.valueOf(tty) : '');

  // change output styles for repsonse messages
  ttycolor.styles(defaultStyles);
}

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

  // print fetch response
  req.print = print.bind(this);

  this.getCrawler = getCrawler.bind(this);

  //info.args = info.args.concat(req.patterns);
  next();
}

module.exports = before;
