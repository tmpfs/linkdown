var ttycolor = require('ttycolor')
  , ansi = ttycolor.ansi
  , prettyBytes = require('pretty-bytes')
  , ms = require('ms');

function summary(req) {
  var queue = req.crawler.queue
    , total = queue.length
    , completed = queue.complete()
    , errors = queue.errors();

  // request time (requestLatency, requestTime, downloadTime)
  this.log.info(
    '%s Min: %s, Max: %s, Avg: %s',
    ansi('HEAD').blue,
    ansi(ms(Math.round(queue.min('requestLatency')))).cyan,
    ansi(ms(Math.round(queue.max('requestLatency')))).green,
    ansi(ms(Math.round(queue.avg('requestLatency')))).red);
  this.log.info(
    '%s Min: %s, Max: %s, Avg: %s',
    ansi('BODY').blue,
    ansi(ms(Math.round(queue.min('downloadTime')))).cyan,
    ansi(ms(Math.round(queue.max('downloadTime')))).green,
    ansi(ms(Math.round(queue.avg('downloadTime')))).red);
  this.log.info(
    '%s Min: %s, Max: %s, Avg: %s',
    ansi('TIME').blue,
    ansi(ms(Math.round(queue.min('requestTime')))).cyan,
    ansi(ms(Math.round(queue.max('requestTime')))).green,
    ansi(ms(Math.round(queue.avg('requestTime')))).red);

  // body byte size
  this.log.info(
    '%s Min: %s, Max: %s, Avg: %s',
    ansi('SIZE').blue,
    ansi(prettyBytes(queue.min('actualDataSize'))).cyan,
    ansi(prettyBytes(queue.max('actualDataSize'))).green,
    ansi(prettyBytes(queue.avg('actualDataSize'))).red);

  // basic request information
  this.log.info(
    '%s Total: %s, Complete: %s, Errors: %s',
    ansi('HTTP').blue,
    ansi(total).cyan,
    ansi(completed).green,
    ansi(errors).red);
}

module.exports = summary;
