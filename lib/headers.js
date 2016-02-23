var ttycolor = require('ttycolor')
  , ansi = ttycolor.ansi
  //, bytes = require('pretty-bytes')
  , defaultStyles = require('./styles/defaults')
  , responseStyles = require('./styles/response');

/**
 *  Print a crawl fetchheaders response.
 */
function print(state) {

  // change output styles for repsonse messages
  ttycolor.styles(responseStyles);

  var status = state.item.stateData.code
    , response = state.response
    //, success = /^(2|3)/.test('' + status)
    , clientError = /^(4)/.test('' + status)
    , serverError = /^(5)/.test('' + status)
    , color = 'green'
    , stream = process.stderr
    , tty;

  tty = state.req.tty(stream);

  if(clientError || serverError) {
    color = 'red';
  }

  function headers(map, prefix) {
    for(var k in map) {
      this.log.debug('%s %s: %s',
        prefix, ansi(k).yellow, map[k]); 
    }    
  }

  if(this.log.enabled(this.log.DEBUG) && response) {
    this.log.debug('%s %s', ansi('GET').cyan, ansi(state.item.url).yellow);
    // request headers
    if(response.socket && response.socket._httpMessage) {
      headers.call(this,
        response.socket._httpMessage._headers, ansi('GET').cyan);
    }
    // response headers
    if(response.headers) {
      headers.call(this, response.headers, ansi(status)[color]);
    }
  }

  // change output styles for repsonse messages
  ttycolor.styles(defaultStyles);
}

module.exports = print;
