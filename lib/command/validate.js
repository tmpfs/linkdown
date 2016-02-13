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
        , result
        , pass = false
        , sleep
        , map = {};

      this.log.debug('write file: %s', file);
      fs.writeFileSync(file, buf);

      // track files so we can map
      // .html file paths to the remote URL
      map['file:' + file] = {
        url: item.url,
        output: output,
        item: item
      }

      // setup command options
      cmd = util.format('java -jar %s --format json %s', jar, file);
      opts = {env: process.env, stdio: [0, 1, fs.openSync(output, 'w')]};
      this.log.debug('%s', cmd);

      try {
        execSync(cmd, opts);
      }catch(e) {
        this.log.error('validation failed on %s', item.url); 
      }

      // read in validation output and parse
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

      // handle validation result
      if(result && result.messages) {
        if(!result.messages.length) {
          pass = true;
          this.log.info('validation passed %s', ansi(item.url).green); 
        }else{
          printer.call(this, result, map);
        }
      }

      // TODO: listen for process exit and unlink these too
      fs.unlinkSync(file);
      fs.unlinkSync(output);

      // running java kills my machine
      // wait a little while
      sleep = pass ? this.configuration.validate.sleep.pass
        : this.configuration.validate.sleep.fail;
      execSync(
        'sleep ' + (parseFloat(sleep) || 0));
    }else{
      this.log.warn('no buffer available for %s', item.url);
    }
  }

  crawler.on("fetchcomplete", onFetchComplete.bind(this));

  crawler.on('complete', function onComplete() {
    next();
  });
}

/**
 *  Print the validation result.
 */
function printer(result, map) {
  //console.dir(result);
  var messages = result.messages
    , i
    , msg
    , type
    , method;
  //console.dir(result);
  var info = map[messages[0].url];
  //console.dir(info);
  this.log.info('validation messages for %s', ansi(info.url).underline);
  for(i = 0;i < messages.length;i++) {
    msg = messages[i];
    type = msg.type;
    method = 'info';
    if(type === 'error') {
      method = 'error';
    }else if(type === 'info' && msg.subType === 'warning') {
      method = 'warn'; 
    }
    //console.dir(msg);
    //this.log.info(message.extract);
    this.log[method].call(this.log, msg.message);
    this.log[method].call(this.log, msg.extract);
  }
}

module.exports = validate;