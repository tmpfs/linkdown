var ttycolor = require('ttycolor')
  , ansi = ttycolor.ansi
  , bytes = require('pretty-bytes')
  , ms = require('ms')
  // request time (requestLatency, requestTime, downloadTime)
  , fields = [
    {
      field: 'requestLatency',
      property: 'headers',
      prefix: 'HEAD',
      format: ms,
      color: 'cyan'
    },
    {
      field: 'downloadTime', 
      property: 'body',
      prefix: 'BODY',
      format: ms,
      color: 'cyan'
    },
    {
      field: 'requestTime',
      property: 'request',
      prefix: 'TIME',
      format: ms,
      color: 'cyan'
    },
    {
      field: 'actualDataSize',
      property: 'size',
      prefix: 'SIZE',
      format: bytes,
      color: 'yellow'
    }
  ]
  , types = ['min', 'max', 'avg']
  , totals = [
    {method: 'getLength', field: 'length'},
    {method: 'complete', field: 'complete'},
    {method: 'errors', field: 'errors'},
  ];

/**
 *  Generate summary object for crawl.
 */
function summary(req, cb) {
  var queue = req.crawler.queue
    , result = {length: 0, complete: 0, errors: 0, stats: {}}
    , requests = totals.slice()
    , stats = fields.slice();

  // iterate statistics fields for each type, ie: min, max, avg
  function item(def, cb) {
    var type = def.types.shift()
    if(!type) {
      return cb(null); 
    }

    queue[type].call(queue, def.field, function(err, size) {
      /* istanbul ignore next: not going to mock this */
      if(err) {
        return cb(err); 
      } 
      result.stats[def.property][type] = size;
      item(def, cb);
    });
  }

  // iterate statistics fields
  function statistics() {
    var def = stats.shift();
    if(!def) {
      return cb(null, result);
    }

    def.types = types.slice(0);
    result.stats[def.property] = {};

    item(def, function onItemStats(err) {
      /* istanbul ignore next: not going to mock this */
      if(err) {
        return cb(err);
      }

      // load next item data
      statistics();
    })
  }

  function info() {
    var def = requests.shift();
    if(!def) {
      // now fetch statistics
      return statistics();
    }

    queue[def.method].call(queue, function(err, size) {
      /* istanbul ignore next: not going to mock this */
      if(err) {
        return cb(err); 
      } 
      result[def.field] = size;
      info();
    })
  }

  info();
}

/**
 *  Print summary to logger.
 */
function print(res) {

  // statistics
  function onStat(item) {
    var min = Math.round(res.stats[item.property].min || 0)
      , max = Math.round(res.stats[item.property].max || 0)
      , avg = Math.round(res.stats[item.property].avg || 0);
    this.log.info(
      '%s Min: %s, Max: %s, Avg: %s',
      ansi(item.prefix).blue,
      ansi(item.format(min))[item.color],
      ansi(item.format(max))[item.color],
      ansi(item.format(avg))[item.color]);
  }
  fields.forEach(onStat.bind(this));

  // totals
  this.log.info(
    '%s Total: %s, Complete: %s, Errors: %s',
    ansi('HTTP').blue,
    ansi(res.length).blue,
    ansi(res.complete).green,
    ansi(res.errors).red);
}

summary.print = print;

module.exports = summary;
