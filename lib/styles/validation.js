var ansi = require('ttycolor').ansi;

/* istanbul ignore next: don't normally print in test env */
module.exports = {
  log: {
    format: ['normal'],
    parameters: ['normal']
  },
  info: {
    format: ['normal'],
    parameters: ['normal']
  },
  warn: {
    format: ['magenta'],
    parameters: ['magenta']
  },
  error: {
    format: ['normal'],
    parameters: ['red'],
    params: {
      '0': function(arg) {
        return ansi(arg).normal;
      }
    }
  }
}

