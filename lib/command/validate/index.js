var State = require('../../state')
  , fs = require('fs')
  , url = require('url')
  , execSync = require('child_process').execSync
  , canonical = require('../../canonical');

/**
 *  Validate HTML pages with the nu validator.
 *
 *  @see https://github.com/validator/validator
 */
function validate(info, req, next) {
  var uri = info.args[0]
    , parsed
    , jar = this.jar || process.env.NU_VALIDATOR_JAR
    , java = 'java'
    , cmd = 'command -v ' + java;

  if(!uri) {
    this.raise(this.errors.EURL);
  }

  parsed = url.parse(uri);

  if(!/^https?:/.test(parsed.protocol)) {
    this.raise(this.errors.EINVALID_PROTOCOL, ['http', 'https']);
  }

  try{
    execSync(cmd);
  }catch(e) {
    this.raise(this.errors.EJAVA, [java, cmd]);
  }

  if(!jar) {
    this.raise(this.errors.ENU_VALIDATOR_JAR);
  }

  if(!fs.existsSync(jar)) {
    this.raise(this.errors.ENOJAR, [jar]);
  }

  info.jar = jar;

  var crawler = this.getCrawler(uri);

  /**
   *  Default fetch condition.
   */
  function fetch(url) {
    // TODO: allow exclude patterns

    var file = this.configuration.validate.fetch.file
      , directory= this.configuration.validate.fetch.directory;
    var fetches = file.test(url.uriPath) || !directory.test(url.uriPath);
    this.log.trace('fetch %s %s', fetches ? 'yes' : 'no', canonical(url));

    return fetches;
  }

  crawler.addFetchCondition(fetch.bind(this));

  function onError(item, res) {
    req.print(new State(info, req, crawler, item, null, res));
  }

  crawler.on('fetcherror', onError).on('fetch404', onError);

  var onFetchComplete = require('./fetch-complete')(info, req, crawler);

  crawler.on("fetchcomplete", onFetchComplete.bind(this));

  crawler.on('complete', function onComplete() {
    next();
  });
}

module.exports = validate;
