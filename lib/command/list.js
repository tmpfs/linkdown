var url = require('url')
  , env = require('nenv')()
  , ansi = require('ttycolor').ansi;

/**
 *  List discovered links.
 */
function ls(info, req, next) {

  var uri = info.args[0]
    , parsed;

  if(!uri) {
    return this.raise(this.errors.EURL);
  }

  parsed = url.parse(uri);

  if(!/^https?:/.test(parsed.protocol)) {
    return this.raise(this.errors.EINVALID_PROTOCOL, ['http', 'https']);
  }

  var crawler = this.crawler(parsed, info, req);

  function onDiscoveryComplete(item, resources) {
    var i
      , res;
    /* istanbul ignore if: keep the test runner output clean */
    if(this.json && !env.debug && !env.test) {
      res = {url: item.url, resources: resources};
      process.stdout.write(JSON.stringify(res) + '\n');
    }else{
      for(i =0;i < resources.length;i++) {
        this.log.info('%s %s',
          ansi('URL').cyan,
          ansi(resources[i]).yellow);
      }
    }
  }

  crawler.on('discoverycomplete', onDiscoveryComplete.bind(this));

  crawler.on('complete', function onComplete() {
    next();
  });

  crawler.start();
}

module.exports = ls;
