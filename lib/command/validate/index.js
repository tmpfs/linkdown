var fs = require('fs')
  , url = require('url')
  , execSync = require('child_process').execSync
  , canonical = require('../../canonical')
  , formats = ["gnu", "xml", "json", "text"];

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
    return this.raise(this.errors.EURL);
  }

  parsed = url.parse(uri);

  if(!/^https?:/.test(parsed.protocol)) {
    return this.raise(this.errors.EINVALID_PROTOCOL, ['http', 'https']);
  }

  if(this.format && !~formats.indexOf(this.format)) {
    return this.raise(
      this.errors.EINVALID_FORMAT, [this.format, formats.join(', ')]);
  }

  try{
    execSync(cmd);
  }catch(e) {
    /* istanbul ignore next: not going to mock missing executable */
    return this.raise(this.errors.EJAVA, [java, cmd]);
  }

  if(!jar) {
    return this.raise(this.errors.ENU_VALIDATOR_JAR);
  }

  if(!fs.existsSync(jar)) {
    return this.raise(this.errors.ENOJAR, [jar]);
  }

  info.jar = jar;

  var crawler = this.crawler(uri, info, req);

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

  var onFetchComplete = require('./fetch-complete')(info, req, crawler);

  crawler.on("fetchcomplete", onFetchComplete.bind(this));

  crawler.on('complete', function onComplete() {
    next();
  });

  crawler.start();
}

module.exports = validate;
