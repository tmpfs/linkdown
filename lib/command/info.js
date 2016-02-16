var url = require('url');

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

  var crawler = this.crawler(parsed, info, req);

  crawler.on('complete', function onComplete() {
    next();
  });

  crawler.start();
}

module.exports = info;
