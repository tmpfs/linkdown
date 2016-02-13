var State = require('../state');

/**
 *  Print the crawl information.
 */
function info(info, req, next) {

  var url = info.args[0];

  if(!url) {
    this.raise(this.errors.EURL);
  }

  var crawler = this.getCrawler(url);

  function onError(item, response) {
    //console.dir(arguments);
    req.printResponse(new State(info, req, crawler, item, null, response));
  }

  crawler.on('fetcherror', onError).on('fetch404', onError);

  crawler.on('fetchcomplete', function(item, buffer, response) {
    req.printResponse(new State(info, req, crawler, item, buffer, response));
  })
  

  crawler.on('complete', function onComplete() {
    //console.log('complete'); 
    next();
  });
}

module.exports = info;
