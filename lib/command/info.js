//var print = require('../util/print');

var Crawler = require('simplecrawler');

/**
 *  Print the crawl information.
 */
function info(info, req, next) {
  var crawler = Crawler.crawl('http://localhost:3000');
  crawler.downloadUnsupported = false;
  crawler.userAgent = 'Linkdown';
  crawler.interval = 200;
  crawler.maxConcurrency = 25;
  if(this.depth) {
    crawler.maxDepth = parseInt(this.depth);
  }
  crawler.on('fetchcomplete', function(item, buffer, response) {
    req.printResponse(item, buffer, response);
    //console.log('%s %s (%s bytes)',
      //item.stateData.code, item.url, buffer.length);
  })
  crawler.on('complete', next);
}

module.exports = info;
