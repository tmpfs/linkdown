var fs = require('fs');

/**
 *  Write the statistics report at the end of a crawl 
 *  to disc as a JSON document.
 */
function report(file, stats, cb) {
  fs.writeFile(file, JSON.stringify(stats, undefined, 2), function(err) {
    /* istanbul ignore next: not going to mock this io error */
    if(err) {
      return cb(err); 
    }
    cb(null);
  })
}

module.exports = report;
