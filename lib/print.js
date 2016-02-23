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
    , response = state.response
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
    /* istanbul ignore next: not going to mock this cosmetic branch */
    this.log[method](
      '%s %s (%s)',
      ansi(status)[success ? 'green' : 'red' ].valueOf(tty),
      state.item.url,
      ansi(bytes(state.buffer.length || 0)).yellow.valueOf(tty));
  }else{
    /* istanbul ignore next: not going to mock this cosmetic branch */
    this.log[method](
      '%s %s',
      ansi(status)[success ? 'green' : 'red' ].valueOf(tty),
      state.item.url);
  }

  function headers(map, prefix) {
    for(var k in map) {
      this.log.debug('%s %s: %s',
        prefix, ansi(k).yellow, map[k]); 
    }    
  }

  if(this.log.enabled(this.log.DEBUG) && response) {
    // request headers
    if(response.socket && response.socket._httpMessage) {
      //console.dir(response.socket._httpMessage);
      //console.dir(response.socket._httpmessage._headers); 
      headers.call(this,
        response.socket._httpMessage._headers, ansi('REQ').cyan);
    }
    // response headers
    if(response.headers) {
      headers.call(this, response.headers, ansi('RES').blue);
    }
  }

  // change output styles for repsonse messages
  ttycolor.styles(defaultStyles);
}

module.exports = print;
