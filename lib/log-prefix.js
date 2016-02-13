var util = require('util')
  , ttycolor = require('ttycolor')
  , ansi = ttycolor.ansi;

function prefix(record, tty) {
  var symbol = '|'
    , fmt = '%s ' + symbol
    , nm = this.names(record.level);

  // pad info etc.
  if(nm.length < 5) {
    nm = ' ' + nm;
  }

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
