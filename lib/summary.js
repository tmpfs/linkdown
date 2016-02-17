var ttycolor = require('ttycolor')
  , ansi = ttycolor.ansi
  , bytes = require('pretty-bytes')
  , ms = require('ms');

function summary(req) {
  var queue = req.crawler.queue
    , total = queue.length
    , completed = queue.complete()
    , errors = queue.errors();

  // request time (requestLatency, requestTime, downloadTime)
  var stats = [
    {field: 'requestLatency', prefix: 'HEAD', format: ms, color: 'cyan'},
    {field: 'downloadTime', prefix: 'BODY', format: ms, color: 'cyan'},
    {field: 'requestTime', prefix: 'TIME', format: ms, color: 'cyan'},
    {field: 'actualDataSize', prefix: 'SIZE', format: bytes, color: 'yellow'}
  ];

  function onStat(item) {
    this.log.info(
      '%s Min: %s, Max: %s, Avg: %s',
      ansi(item.prefix).blue,
      ansi(item.format(Math.round(queue.min(item.field))))[item.color],
      ansi(item.format(Math.round(queue.max(item.field))))[item.color],
      ansi(item.format(Math.round(queue.avg(item.field))))[item.color]);
  }

  stats.forEach(onStat.bind(this));

  // basic request information
  this.log.info(
    '%s Total: %s, Complete: %s, Errors: %s',
    ansi('HTTP').blue,
    ansi(total).blue,
    ansi(completed).green,
    ansi(errors).red);
}

module.exports = summary;
