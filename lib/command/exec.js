var url = require('url')
  , spawn = require('child_process').spawn
  // keep track of running processes so we can wait
  // for them to finish before calling next()
  , map = {};

/**
 *  Execute a program for each downloaded resource.
 */
function exec(info, req, next) {

  var uri = info.args[0]
    , parsed;

  if(!uri) {
    return this.raise(this.errors.EURL);
  }

  parsed = url.parse(uri);

  if(!/^https?:/.test(parsed.protocol)) {
    return this.raise(this.errors.EINVALID_PROTOCOL, ['http', 'https']);
  }

  if(!this.cmd) {
    return this.raise(this.errors.ECMD);
  }

  var crawler = this.crawler(parsed, info, req);

  req.stdout.setMaxListeners(2048);
  req.stderr.setMaxListeners(2048);

  /**
   *  Run the command.
   */
  function run(item, buf/*, res*/) {
    var ps
      , opts = {env: process.env}
      , cmd = this.cmd
      , parts
      , args = [];

    if(/\s+/.test(this.cmd)) {
      parts = cmd.split(/\s/);
      cmd = parts[0];
      args = parts.slice(1);
    }

    if(req.result.skip) {
      args = args.concat(req.result.skip); 
    }

    if(this.json) {
      args.push(JSON.stringify(item)); 
    }

    this.log.debug('%s %s', cmd, args.join(' '));

    function onExit(code/*, signal*/) {
      this.log.debug('%s exited with %s', cmd, code); 
      delete map[ps.pid];
    }

    ps = spawn(cmd, args, opts);
    this.log.debug('%s (pid: %s)', cmd, ps.pid);
    map[ps.pid] = ps;
    ps.stdout.pipe(req.stdout);
    ps.stderr.pipe(req.stderr);
    ps.stdin.on('error', function(err) {
      // NOTE: not considered an error if not all of stdin was consumed
      // SEE: https://github.com/nodejs/node/issues/947

      /* istanbul ignore next: not going to mock this */
      if(err.code !== 'EPIPE') {
        throw err;
      }
    })
    ps.on('exit', onExit.bind(this));
    ps.stdin.end(buf);
  }

  crawler.on('fetchcomplete', run.bind(this));

  crawler.on('complete', function onComplete() {
    var pids = Object.keys(map)
      , immediate;

    // NOTE: we need to wait otherwise the normal process exit logic
    // NOTE: can interrupt running child processes that have not yet 
    // NOTE: finished

    /* istanbul ignore next: cannot mock, depends on process.exit() */
    function waitForChildren() {
      var children = Object.keys(map);
      if(children.length) {
        clearImmediate(immediate);
        immediate = setImmediate(waitForChildren); 
      }else{
        clearImmediate(immediate);
        next();
      }
    }

    /* istanbul ignore if: cannot mock, depends on process.exit() */
    if(pids.length) {
      immediate = setImmediate(waitForChildren);
    }else{
      next();
    }
  });

  crawler.start();
}

module.exports = exec;
