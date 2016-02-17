var path = require('path')
  , merge = require('merge')
  , signals = require('./signals')
  , State = require('./state')
  , Crawler = require('simplecrawler');

/**
 *  Creates a new crawler.
 *
 *  @param url The parsed url.
 *  @param info The command info object.
 *  @param req The program request object.
 */
function getCrawler(url, info, req) {
  var host = url.hostname
    , pathname = url.pathname
    , port
    , crawler
    , conf = require('../linkdown.js')
    , crawl
    , i
    , file
    , mod
    , k
    , v
    , cliconf = this.conf;

  /* istanbul ignore next: always using port in test env */
  port = url.port ? parseInt(url.port) : null;
  crawler = new Crawler(host, pathname, port);

  crawler.initialProtocol = url.protocol.replace(':$', '');

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

  // reference so commands can access
  // the final configuration
  this.configuration = conf;

  // assign to the crawler
  crawl = conf.crawl;
  for(k in crawl) {
    if(crawler.hasOwnProperty(k)) {
      v = crawler[k];
      crawler[k] = crawl[k];
      this.log.debug(
        'set %s=%s (old: %s, new: %s)', k, crawl[k], v, crawler[k]);
    } 
  }

  // add this for granular logging
  function onQueueAdd(item) {
    this.log.trace('queue add %s', item.url)
  }
  crawler.on('queueadd', onQueueAdd.bind(this));

  // print errors
  var error = (function onError(item, res) {
    this.print(new State(info, req, crawler, item, null, res));

    // handle --bail option
    if(this.bail === true && !/^2/.test(item.stateData.code)) {
      // in test env the process does not exit so attempt
      // to stop the crawler
      crawler.stop();
      this.raise(this.errors.EBAIL, [item.stateData.code, item.url]);
    }
  }).bind(this);

  crawler.on('fetcherror', error)
    .on('fetch404', error)
    // assuming PR is merged
    .on('fetch410', error)
    .on('fetchclienterror', error);

  // TODO: allow this fetch condition to be optional
  function onConstrainPort(url/*, item*/) {
    this.log.debug('same domain %s:%s (%s:%s)', url.host, url.port, host, port);
    return (host === url.host && port === parseInt(url.port));
  }
  crawler.addFetchCondition(onConstrainPort.bind(this));

  // print downloaded stuff
  function onFetchComplete(item, buf, res) {
    this.print(new State(info, req, crawler, item, buf, res));
  }
  crawler.on('fetchcomplete', onFetchComplete.bind(this));

  // override with command line args
  if(this.depth) {
    crawler.maxDepth = parseInt(this.depth);
  }

  signals.call(this, crawler);

  // inject into the program request so generic `complete`
  // listeners can access the crawler stats
  req.crawler = crawler;

  return crawler;
}

module.exports = getCrawler;
