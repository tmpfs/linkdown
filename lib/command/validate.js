var State = require('../state')
  , url = require('url')
  , canonical = require('../canonical');

/**
 *  Validate HTML pages with the nu validator.
 *
 *  @see https://github.com/validator/validator
 */
function validate(info, req, next) {

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

  function fetch(url) {
    var file = this.configuration.validate.fetch.file
      , directory= this.configuration.validate.fetch.directory;
        
    //return !url.path.match(/\.pdf$/i);
    var fetches = file.test(url.uriPath) || !directory.test(url.uriPath);

    this.log.debug('fetch %s %s', fetches ? 'yes' : 'no', canonical(url));

    return fetches;
  }

  crawler.addFetchCondition(fetch.bind(this));

  function onError(item, response) {
    req.print(new State(info, req, crawler, item, null, response));
  }

  crawler.on('fetcherror', onError).on('fetch404', onError);

  crawler.on('fetchcomplete', function(item, buffer, response) {
    req.print(new State(info, req, crawler, item, buffer, response));
  })

  crawler.on('complete', function onComplete() {
    next();
  });
}

module.exports = validate;
