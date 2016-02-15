var path = require('path')
  , uri = require('url')
  , merge = require('merge')
  , State = require('./state')
  //, canonical = require('./canonical')
  , Crawler = require('simplecrawler');

function getCrawler(url, info, req) {
  var u = uri.parse(url)
    , host = u.hostname
    , pathname = u.pathname
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
  port = u.port ? parseInt(u.port) : null;
  crawler = new Crawler(host, pathname, port);

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

  if(this.follow !== false) {
    crawler.on('fetchredirect', function(item, url) {
      //return canonical(url);
      return url;
    })
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
    .on('fetchclienterror', error);

  function onConstrainPort(url/*, item*/) {
    this.log.debug('same domain %s:%s (%s:%s)', url.host, url.port, host, port);

    //if((url.host === host && parseInt(url.port) !== port)) {
      //this.log.debug('skip on different ports %s:%s (%s:%s)', url.host, url.port, host, port);
      //return false;
    //}

    //
    //
    //if(url.port === '3002') {
      //console.log('SKIPPING ON PORT %j', url); 
    //}

    return (host === url.host && port === parseInt(url.port));

    //return (url.host === host) && parseInt(url.port) === port;

    //if(url.host === host && parseInt(url.port) !== port) {
      //this.log.debug('skip on different ports %s:%s (%s:%s)', url.host, url.port, host, port);
      //return false; 
    //}
    //this.log.debug('allow ports %s:%s (%s:%s)', url.host, url.port, host, port);
    ////console.dir(url.host === host);
    ////console.dir(parseInt(url.port) !== port);
    //return true;
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

  return crawler;
}

module.exports = getCrawler;
