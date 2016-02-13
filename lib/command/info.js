var State = require('../state')
  , url = require('url');

/**
 *  Print the crawl information.
 */
function info(info, req, next) {

  var uri = info.args[0]
    , parsed;

  if(!uri) {
    this.raise(this.errors.EURL);
  }

  parsed = url.parse(uri);

  if(!/^https?:/.test(parsed.protocol)) {
    this.raise(this.errors.EINVALID_PROTOCOL, ['http', 'https']);
  }

  var crawler = this.getCrawler(uri);

  function onError(item, response) {
    req.printResponse(new State(info, req, crawler, item, null, response));
  }

  crawler.on('fetcherror', onError).on('fetch404', onError);

  crawler.on('fetchcomplete', function(item, buffer, response) {
    req.printResponse(new State(info, req, crawler, item, buffer, response));
  })

  crawler.on('complete', function onComplete() {
    next();
  });
}

module.exports = info;
