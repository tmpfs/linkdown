var fs = require('fs')
  , util = require('util')
  , execSync = require('child_process').execSync
  , ansi = require('ttycolor').ansi
  , tempfile = require('tempfile')
  , printer = require('./print')
  , State = require('../../state')

/**
 *  Returns a closure that may be added to the crawler 
 *  `fetchcomplete` event.
 */
function fetch(info, req, crawler) {

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
  return function onFetchComplete(item, buf, res) {

    // print the output of the request (info)
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
        , map = {}
        , args = []
        , format = 'json';

      if(this.errorsOnly) {
        args.push('--errors-only'); 
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
}

module.exports = fetch;
