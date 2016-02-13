/**
 *  Encapsulates command and crawl state.
 */
function State(info, req, crawler, item, buffer, response) {
  // cli command processing information
  this.info = info;

  // cli request object
  this.req = req;

  // crawler being used
  this.crawler = crawler;

  // crawl fetch item
  this.item = item;

  // crawl fetch buffer
  this.buffer = buffer;

  // crawl fetch response object
  this.response = response;
}

module.exports = State;
