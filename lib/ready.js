var logger = require('cli-logger');

function ready(req, next) {
  var keys = logger.keys.concat('none');

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

  next();
}

module.exports = ready;
