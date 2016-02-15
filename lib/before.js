var path = require('path')
  , uri = require('url')
  , print = require('./print')
  , merge = require('merge')
  , State = require('./state')
  , Crawler = require('simplecrawler');

function getCrawler(url, info, req) {
  var u = uri.parse(url)
    , host = u.hostname
    , pathname = u.pathname
    , port = u.port ? parseInt(u.port) : null
    , crawler = new Crawler(host, pathname, port)
    , conf = require('../linkdown.js')
    , crawl
    , i
    , file
    , mod
    , k
    , v
    , cliconf = this.conf;

  crawler.initialProtocol = u.protocol.replace(':$', '');

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

  function onError(item, res) {
    req.print(new State(info, req, crawler, item, null, res));
  }

  crawler.on('fetcherror', onError)
    .on('fetch404', onError)
    .on('fetchclienterror', onError);

  crawler.on('fetchcomplete', function(item, buf, res) {
    req.print(new State(info, req, crawler, item, buf, res));
  })

  crawler.on('queueadd', onQueueAdd.bind(this));

  // override with command line args
  if(this.depth) {
    crawler.maxDepth = parseInt(this.depth);
  }

  return crawler;
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
