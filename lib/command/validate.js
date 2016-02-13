var State = require('../state')
  , url = require('url')
  , fs = require('fs')
  , util = require('util')
  , execSync = require('child_process').execSync
  , tempfile = require('tempfile')
  , ansi = require('ttycolor').ansi
  , canonical = require('../canonical');

/**
 *  Validate HTML pages with the nu validator.
 *
 *  @see https://github.com/validator/validator
 */
function validate(info, req, next) {
  var uri = info.args[0]
    , parsed
    , jar = process.env.HOME + '/bin/vnu/vnu.jar';

  if(!uri) {
    this.raise(this.errors.EURL);
  }

  parsed = url.parse(uri);

  if(!/^https?:/.test(parsed.protocol)) {
    this.raise(this.errors.EINVALID_PROTOCOL, ['http', 'https']);
  }

  var crawler = this.getCrawler(uri);

  /**
   *  Default fetch condition.
   */
  function fetch(url) {
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

  function onFetchComplete(item, buf, res) {
    req.print(new State(info, req, crawler, item, buf, res));

    if(buf && buf.length) {
      var file = tempfile('.html')
        , output = file + '.json'
        , cmd
        , opts
        , result;

      this.log.debug('write file: %s', file);
      fs.writeFileSync(file, buf);
      cmd = util.format('java -jar %s --format json %s', jar, file);
      opts = {env: process.env, stdio: [0, 1, fs.openSync(output, 'w')]};
      this.log.debug('%s', cmd);
      try {
        execSync(cmd, opts);
      }catch(e) {
        this.log.error('validation failed on %s', item.url); 
      }


      try {
        result = '' + fs.readFileSync(output); 
      }catch(e) {
        this.log.error('failed to read output file %s', output); 
      }

      try {
        result = JSON.parse(result); 
      }catch(e) {
        this.log.error('failed to parse output file %s', output); 
      }

      if(result && result.messages) {
        if(!result.messages.length) {
          this.log.info('validation passed %s', ansi(item.url).green); 
        }else{
          console.dir(result);
        }
      }

      fs.unlinkSync(file);
      fs.unlinkSync(output);

      // running java kills my machine
      // wait a little while
      execSync(
        'sleep ' + (parseInt(this.configuration.validate.sleep) || 0));
    }else{
      this.log.warn('no buffer available for %s', item.url);
    }
  }

  crawler.on("fetchcomplete", onFetchComplete.bind(this));

  crawler.on('complete', function onComplete() {
    next();
  });
}

module.exports = validate;
