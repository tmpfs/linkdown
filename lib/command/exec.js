var url = require('url')
  , spawn = require('child_process').spawn;

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

    this.log.debug('%s %s', cmd, args.join(' '));
    ps = spawn(cmd, args, opts);
    ps.stdout.pipe(process.stdout);
    ps.stderr.pipe(process.stderr);
    ps.stdin.on('error', function(err) {
      if(err.code !== 'EPIPE') {
        throw err;
      }
    })
    ps.stdin.write(buf);
    ps.stdin.end('\n');
  }

  crawler.on('fetchcomplete', run.bind(this));

  crawler.on('complete', function onComplete() {
    next();
  });

  crawler.start();
}

module.exports = exec;
