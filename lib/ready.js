var logger = require('cli-logger');

function ready(req, next) {
  var keys = logger.keys.concat('none');
  if(this.logLevel && ~keys.indexOf(this.logLevel)) {
    this.log.levels(0, this.logLevel);
  }
  next();
}

module.exports = ready;
