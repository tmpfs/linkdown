var State = require('../state')
  , url = require('url')
  , fs = require('fs')
  , util = require('util')
  , execSync = require('child_process').execSync
  , tempfile = require('tempfile')
  , ttycolor = require('ttycolor')
  , repeat = require('string-repeater')
  , wrap = require('cli-util').wrap
  , ansi = ttycolor.ansi
  , canonical = require('../canonical')
  , defaultStyles = require('../styles/defaults')
  , validationStyles = require('../styles/validation');

/**
 *  Validate HTML pages with the nu validator.
 *
 *  @see https://github.com/validator/validator
 */
function validate(info, req, next) {
  var uri = info.args[0]
    , parsed
    , jar = process.env.HOME + '/bin/vnu/vnu.jar';

  // TODO: check for java
  // TODO: check for NU_VALIDATOR_JAR

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

  function onFetchComplete(item, buf, res) {
    req.print(new State(info, req, crawler, item, buf, res));

    // TODO: check contentType includes text/html

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
 *
 *  @see https://github.com/validator/validator/wiki/Output%3A-JSON
 */
function printer(result, map) {

  // change output styles for validation messages
  ttycolor.styles(validationStyles);

  var messages = result.messages
    , i
    , msg
    , type
    , message
    , method
    , info = map[messages[0].url]
    , fields
    , index
    , space = ' '
    , indent = space + space
    , firstLine
    , lastLine
    , firstColumn
    , lastColumn
    , position
    , extractFirst
    , extractHilite
    , extractLast
    , pointer
    , wrapAt = 80;

  for(i = 0;i < messages.length;i++) {
    msg = messages[i];
    type = msg.type;
    method = 'info';
    index = (i + 1) + ')';
    message = msg.message;

    firstLine = msg.firstLine || msg.lastLine;
    lastLine = msg.lastLine;
    firstColumn = msg.firstColumn || msg.lastColumn;
    lastColumn = msg.lastColumn;

    position = util.format(
      'From line %s, column %s; to line %s, column %s',
      firstLine,
      firstColumn,
      lastLine,
      lastColumn);

    if(type === 'error') {
      method = 'error';
    }else if(type === 'info' && msg.subType === 'warning') {
      method = 'warn'; 
    }

    fields = {prefix: 'HTML', validator: msg};

    // initial empty line, makes parsing the output easier on the eyes
    if(i === 0) {
      this.log[method].call(this.log, fields, space);
    }

    // always print url, when there are lots of errors the 
    // context can be lost otherwise
    this.log[method].call(
      this.log, fields, '%s %s', ansi(index).normal, ansi(info.url).underline);
    this.log[method].call(this.log, fields, space);

    //print position information
    this.log[method].call(
      this.log, fields, '%s', ansi(position).normal);
    this.log[method].call(this.log, fields, space);

    //console.dir(msg);
    //this.log.info(message.extract);
    if(message) {
      if(message.length > wrapAt) {
        message = wrap(message, 0, wrapAt); 
      }
      this.log[method].call(this.log, fields, message);
      this.log[method].call(this.log, fields, space);
    }

    if(msg.extract) {
      //console.dir(msg);

      if(typeof(msg.hiliteStart) === 'number'
        && typeof(msg.hiliteLength) === 'number') {
        extractFirst = msg.extract.substr(0, msg.hiliteStart);
        extractHilite = msg.extract.substr(msg.hiliteStart, msg.hiliteLength);
        extractLast = msg.extract.substr(msg.hiliteStart + msg.hiliteLength);
        this.log[method].call(
          this.log, fields,
            indent + '%s%s%s',
            ansi(extractFirst).normal,
            ansi(extractHilite).yellow,
            ansi(extractLast).normal);

        pointer = repeat('-', indent.length + msg.hiliteStart);
        pointer += '^';
        this.log[method].call(this.log, fields, pointer);

        this.log[method].call(this.log, fields, space);
      }else{
        this.log[method].call(this.log, fields, indent + msg.extract);
        this.log[method].call(this.log, fields, space);
      }
    }
  }

  // restore default styles
  ttycolor.styles(defaultStyles);
}

module.exports = validate;
