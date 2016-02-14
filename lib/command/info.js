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

  function onError(item, res) {
    req.print(new State(info, req, crawler, item, null, res));
  }

  crawler.on('fetcherror', onError)
    .on('fetch404', onError)
    .on('fetchclienterror', onError);

  crawler.on('fetchcomplete', function(item, buf, res) {
    req.print(new State(info, req, crawler, item, buf, res));
  })

  crawler.on('complete', function onComplete() {
    next();
  });
}

module.exports = info;
