var fs = require('fs')
  , util = require('util')
  , execSync = require('child_process').execSync
  , env = require('nenv')()
  , ansi = require('ttycolor').ansi
  , tempfile = require('tempfile')
  , printer = require('./print')
  //, State = require('../../state')
  , files = [];

/**
 *  Attempt to remove stale temp files on process exit.
 */
/* istanbul ignore next: not going to mock exit */
function onExit() {
  files.forEach(function(file) {
    try {
      fs.unlinkSync(file)
    }catch(e){}
  })
}

/**
 *  Ensure the exit event fires for signals.
 */
/* istanbul ignore next: not going to mock exit */
function exit() {
  process.exit(1);
}

process
  .on('SIGINT', exit)
  .on('SIGTERM', exit);

/**
 *  Returns a closure that may be added to the crawler 
 *  `fetchcomplete` event.
 */
function fetch(info/*, req, crawler*/) {

  process.on('exit', onExit);

  /**
   *  Handler for the fetch complete event.
   *
   *  For once we actually *want* to use the synchronous methods 
   *  otherwise the crawler keeps on going and it is hard to parse the 
   *  output.
   *
   *  Unfortunately the simplecrawler async logic does not pause or block 
   *  crawling so lots of messages would still be printed interrupting the 
   *  output from the validation.
   *
   *  Therefore we use the synchronous filesystem and child_process methods to 
   *  block and keep the program output in sequence.
   */
  return function onFetchComplete(item, buf) {
    var conf = this.configuration
      , contentPattern = conf.validate.contentType
      , contentType = item.stateData.contentType
      , file = tempfile('.html')
      , output = file + '.json'
      , cmd
      , opts
      , result
      , pass = false
      , map = {}
      , args = []
      , format = 'json'
      , userFormat = (this.format !== undefined);

    function cleanFile() {
      fs.unlinkSync(file);
      files.pop();
    }

    function cleanOutput() {
      fs.unlinkSync(output);
      files.pop();
    }

    // print the output of the request (info)
    //req.print(new State(info, req, crawler, item, buf, res));

    this.log.debug('test content type %s with pattern %s',
      contentType, contentPattern);

    if(!contentPattern.test(contentType)) {
      return this.log.warn(
        'invalid content type %s from %s (skipped)',
        ansi(contentType).underline,
        ansi(item.url).underline);
    }

    files.push(output, file);

    /* istanbul ignore else: tough to mock no buffer error */
    if(buf && buf.length) {
      if(this.errorsOnly) {
        args.push('--errors-only'); 
      }

      if(this.format) {
        format = this.format; 
      }

      args.push('--format', format);

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
      args = util.format(' %s ', args.join(' '));
      cmd = util.format(
        'java -jar %s%s %s', info.jar, args, file);
      opts = {env: process.env, stdio: [0, 1, fs.openSync(output, 'w')]};
      this.log.debug('%s', cmd);

      try {
        execSync(cmd, opts);
        cleanFile();
      }catch(e) {
        cleanFile();
        this.log.error('validation failed on %s', item.url); 
      }

      // read in validation output and parse
      try {
        result = '' + fs.readFileSync(output); 
        cleanOutput();
      }catch(e) {
        /* istanbul ignore next: not going to mock io error */
        cleanOutput();
        /* istanbul ignore next: not going to mock io error */
        this.log.error('failed to read output file %s', output); 
      }

      if(!userFormat && result && format === 'json') {
        try {
          result = JSON.parse(result); 
        }catch(e) {
          /* istanbul ignore next: not going to mock parse error */
          this.log.error('failed to parse output file %s', output); 
        }

        // handle validation result
        /* istanbul ignore else: tough to mock bad output from validator */
        if(result && result.messages) {
          if(!result.messages.length) {
            pass = true;
            this.log.info('validation passed %s', ansi(item.url).green); 
          }else{
            printer.call(this, result, map);
          }
        }
      // can't handle this format
      /* istanbul ignore next: suppress output in tests */
      }else if(!env.test) {
        process.stdout.write(item.url + '\n'); 
        process.stdout.write(result); 
        process.stdout.write('\n'); 
      }

    }else{
      this.log.warn('no buffer available for %s', item.url);
    }
  }
}

module.exports = fetch;
