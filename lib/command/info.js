var url = require('url')
  , env = require('nenv')();

/**
 *  Helper to print the JSON document.
 */
function printJson(req, item, buf) {
  /* istanbul ignore if: do not clutter test output */
  if(!env.debug && !env.test) {
    if(buf) {
      item.length = buf.length; 
    }
    req.stdout.write(JSON.stringify(item) + '\n');
  }
}

/**
 *  Print the crawl information.
 */
function info(info, req, next) {

  var uri = info.args[0]
    , parsed;

  if(!uri) {
    return this.raise(this.errors.EURL);
  }

  parsed = url.parse(uri);

  if(!/^https?:/.test(parsed.protocol)) {
    return this.raise(this.errors.EINVALID_PROTOCOL, ['http', 'https']);
  }

  var crawler = this.crawler(parsed, info, req)
    , print = printJson.bind(this, req);

  if(this.json) {
    crawler.on('fetchcomplete', print)
      .on('fetcherror', print)
      .on('fetch404', print)
      // assuming PR is merged
      .on('fetch410', print)
      .on('fetchclienterror', print);
  }

  crawler.on('complete', function onComplete() {
    next();
  });

  crawler.start();
}

module.exports = info;
