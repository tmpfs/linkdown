var ttycolor = require('ttycolor')
  , ansi = ttycolor.ansi
  , bytes = require('pretty-bytes')
  , defaultStyles = require('./styles/defaults')
  , responseStyles = require('./styles/response');

/**
 *  Print a crawl fetch response.
 */
function print(state) {

  // change output styles for repsonse messages
  ttycolor.styles(responseStyles);

  var status = state.item.stateData.code
    , success = /^(2|3)/.test('' + status)
    , clientError = /^(4)/.test('' + status)
    , serverError = /^(5)/.test('' + status)
    , stream = process.stderr
    , tty;

  tty = state.req.tty(stream);

  var method = 'info';

  if(clientError) {
    method = 'warn';
  }else if(serverError) {
    method = 'error';
  }

  if(state.buffer) {
    this.log[method](
      '%s %s (%s)',
      ansi(status)[success ? 'green' : 'red' ].valueOf(tty),
      state.item.url,
      ansi(bytes(state.buffer.length)).yellow.valueOf(tty));
  }else{
    this.log[method](
      '%s %s',
      ansi(status)[success ? 'green' : 'red' ].valueOf(tty),
      state.item.url);
  }

  // change output styles for repsonse messages
  ttycolor.styles(defaultStyles);
}

module.exports = print;
