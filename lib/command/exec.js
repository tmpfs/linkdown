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
    return this.raise('no command specified, use --cmd'); 
  }

  if(/\s+/.test(this.cmd)) {
    return this.raise(
      'invalid command %s, should not contain whitespace', [this.cmd]) 
  }

  var crawler = this.crawler(parsed, info, req);

  /**
   *  Run the command.
   */
  function run(item, buf/*, res*/) {
    var ps
      , opts = {env: process.env}
      , cmd = this.cmd
      , args = req.result.skip || [];

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
    ps.stdout.pipe(process.stdout);
    ps.stderr.pipe(process.stderr);
    ps.stdin.on('error', function(err) {
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

    function waitForChildren() {
      var children = Object.keys(map);
      if(children.length) {
        clearImmediate(immediate);
        immediate = setImmediate(waitForChildren); 
      }else{
        clearImmediate();
        next();
      }
    }

    if(pids.length) {
      immediate = setImmediate(waitForChildren);
    }else{
      next();
    }
  });

  crawler.start();
}

module.exports = exec;
