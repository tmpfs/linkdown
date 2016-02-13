var ansi = require('ttycolor').ansi;

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
    format: ['red'],
    parameters: ['red', 'bright'],
    params: {
      '0': function(arg) {
        return ansi(arg).red;
      }
    }
  }
}

