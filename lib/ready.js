var logger = require('cli-logger')
  , fs = require('fs')
  , pid = require('./pid')
  , PathFilter = require('./path-filter');

//require('http').globalAgent.maxSockets = Number.MAX_VALUE;
//require('http').globalAgent.maxFreeSockets = Number.MAX_VALUE;

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

function ready(req, next) {
  var keys = logger.keys.concat('none');

  if(this.logLevel) {
    if(!~keys.indexOf(this.logLevel)) {
      return this.raise(
        this.errors.ELOG_LEVEL, [this.logLevel, keys.join(', ')]);
    }else{
      this.log.levels(0, this.logLevel);
    }
  }

  if(this.indent) {
    this.indent = parseInt(this.indent);
  }

  // allow mocking stdin
  req.stdin = req.stdin || process.stdin;

  this.exclude = this.exclude || [];
  this.include = this.include || [];

  //console.log(keys);
  //this.log.fatal('fatal %s', 'foo');
  //this.log.warn('warn %s', 'foo');
  //this.log.info('info %s', 'foo');
  //this.log.trace('trace %s', 'foo');
  //this.log.error('error %s', 'foo');
  //this.log.debug('debug %s', 'foo');
  //process.exit();
 
  // usual streams for printing
  req.stdout = process.stdout;
  req.stderr = process.stderr;

  function onError(e) {
    this.raise(this.errors.EOUTPUT, [this.output, e.message]);
  }

  if(this.output) {
    try {
      req.stdout = fs.createWriteStream(this.output, {flags: 'w'});
      req.stdout.on('error', onError.bind(this));
    }catch(e) {
      /* istanbul ignore next: not going to mocj this io error */
      return this.raise(this.errors.EOUTPUT, [this.output, e.message]);
    }
  }

  function onPid(err) {
    /* istanbul ignore next: not going to mock EACCESS etc. */
    if(err) {
      return this.raise(this.errors.EPID, [this.pid, err.message]);
    } 
    next();
  }

  this.pathFilter = new PathFilter();

  var writePid = (function() {
    if(this.pid) {
      pid(this.pid, onPid.bind(this));
    }else{
      next();
    }
  }).bind(this);

  function onPatternFile(err) {
    if(err) {
      return this.raise(err); 
    }
    writePid(); 
  }

  // cli patterns, compile them
  if(this.pattern.length) {
    try {
      this.pathFilter.compile(this.pattern); 
    }catch(e) {
      return this.raise(this.errors.EPTN_COMPILE, [e.message]); 
    }
  }

  // load patterns from file(s)
  if(this.patternFile) {
    this.pathFilter.load(this.patternFile, onPatternFile.bind(this)); 
  }else{
    writePid();
  }
}

module.exports = ready;
