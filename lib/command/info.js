var State = require('../state')
  , url = require('url');

/**
 *  Print the crawl information.
 */
function info(info, req, next) {

  var uri = info.args[0]
    , parsed;

  if(!uri) {
    return this.raise(this.errors.EURL);
  }

  parsed = url.parse(uri);

  if(!/^https?:/.test(parsed.protocol)) {
    return this.raise(this.errors.EINVALID_PROTOCOL, ['http', 'https']);
  }

  var crawler = this.getCrawler(uri);

  //crawler.host = 'localhost';

  function onError(item, res) {
    //console.dir(item);

    req.print(new State(info, req, crawler, item, null, res));
  }

  //crawler.addFetchCondition(function(url, item) {
    //console.dir(arguments); 
    //return true;
  //})

  //crawler.on('fetchheaders', function(item, res) {
    ////console.dir(item); 
    //if(item.stateData.contentType === 'application/pdf') {
      //res.req.abort();
      //console.log('ABORTING ON PDF');
      //item.fetched = true;
      ////crawler.emit("fetchcomplete", item, null, res);
      //crawler.fetchQueueItem(crawler.queue.last());
    //}
    ////crawler.crawl(crawler);
    ////res.req.abort();
  //})

  crawler.on('fetcherror', onError)
    .on('fetch404', onError)
    .on('fetchclienterror', onError);

  crawler.on('fetchcomplete', function(item, buf, res) {
    req.print(new State(info, req, crawler, item, buf, res));
  })

  crawler.on('complete', function onComplete() {
    next();
  });

  crawler.start();
}

module.exports = info;
