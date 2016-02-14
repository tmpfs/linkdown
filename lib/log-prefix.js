var util = require('util')
  , ttycolor = require('ttycolor')
  , repeat = require('string-repeater')
  , ansi = ttycolor.ansi;

/**
 *  Returns the prefix for a log record.
 */
/* istanbul ignore next: don't normally print in test env */
function prefix(record, tty) {
  var symbol = '|'
    , fmt = '%s ' + symbol
    , nm = this.names(record.level)
    , max = 5;

  if(record.prefix) {
    nm = record.prefix; 
  }

  // pad info etc.
  if(nm.length < max) {
    nm = repeat(' ', max - nm.length) + nm;
  }

  //console.dir(record.validator);

  nm = nm.toUpperCase();

  if(!tty) {
    return util.format(fmt, nm);
  }

  var col = 'normal';

  switch(record.level) {
    case this.INFO:
      col = 'green';
      break;
    case this.WARN:
      col = 'magenta';
      break;
    case this.DEBUG:
      col = 'blue';
      break;
    case this.TRACE:
      col = 'yellow';
      break;
    case this.ERROR:
    case this.FATAL:
      col = 'red';
      break;
  }

  var c = ansi(nm)[col].blink.valueOf(tty) + 
    ansi(' ' + symbol).normal.cyan.valueOf(tty);
  return c;
}

module.exports = prefix;
