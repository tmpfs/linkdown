var logger = require('cli-logger')
  , fs = require('fs');

function ready(req, next) {
  var keys = logger.keys.concat('none');

  // TODO: error on invalid log level
  if(this.logLevel && ~keys.indexOf(this.logLevel)) {
    this.log.levels(0, this.logLevel);
  }

  //console.log(keys);
  //this.log.fatal('fatal %s', 'foo');
  //this.log.warn('warn %s', 'foo');
  //this.log.info('info %s', 'foo');
  //this.log.trace('trace %s', 'foo');
  //this.log.error('error %s', 'foo');
  //this.log.debug('debug %s', 'foo');
  //process.exit();
 
  // usual stream for printing
  req.stdout = process.stdout;

  if(this.output) {
    try {
      // NOTE: no idea why: `process.stdout.pipe(stream)` is not working
      req.stdout = fs.createWriteStream(this.output, 'w');
    }catch(e) {
      return this.raise(e);
    }
  }

  next();
}

module.exports = ready;
