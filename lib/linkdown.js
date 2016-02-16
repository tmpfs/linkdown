var path = require('path')
  , util = require('util')
  , glue = require('cli-interface')
  , logger = require('cli-logger')
  , env = require('nenv')()
  , ttycolor = require('ttycolor')
  , ansi = ttycolor.ansi
  , prettyBytes = require('pretty-bytes')
  , ms = require('ms')
  , styles = require('./styles/defaults')
  , pkg = require('../package.json')
  , base = path.normalize(path.join(__dirname, '..'))
  , ready = require('./ready')
  , prefix = require('./log-prefix')
  , beforeCommand = require('./before');

var LinkDown = function() {
  glue.apply(this, arguments);
};

util.inherits(LinkDown, glue);

LinkDown.prototype.configure = function() {
  var file = path.join(__dirname, pkg.name + '.md');
  var conf = {
    start: {
      time: new Date(),
      cwd: process.cwd()
    },
    stdin: true,
    trace: env.devel,
    error: {
      locales: path.join(__dirname, 'message', 'error')
    },
    command: {
      dir: path.join(__dirname, 'command'),
      required: false,
      before: beforeCommand
    },
    compiler: {
      input: [file],
      output: path.join(__dirname, this.name() + 'c.js'),
      cache: (!env.devel && !env.test)
    },
    manual: {
      dir: path.join(base, 'doc', 'man'),
      dynamic: env.devel
    },
    help: {
      width: 26
    },
    ready: ready
  };
  this
    .configure(conf)
    .usage();
}

LinkDown.prototype.use = function() {

  var opts = {
    level: logger.INFO,
    json: false,
    symbol: '|',
    prefix: prefix
  };

  this
    .use(require('cli-mid-color'),
      {
        styles: styles})
    .use(require('cli-mid-logger'), opts)
}

LinkDown.prototype.on = function() {
  this

    // force log prefix to show ansi colors
    .on('color', function(req, arg, value) {
      /* istanbul ignore next: don't use colors in tests */
      if(value === true) {
        ttycolor.mode = ttycolor.modes.always;
        prefix.color = true; 
      }
    })
    .once('load', function(/*req*/) {
      this
        .use(require('cli-mid-manual'))
        .help('-h | --help')
        .version(null, null, 'Print version and exit');
    })
    .on('help:trailers', function ontrailers(doc, data, stream) {
      /* istanbul ignore else: other help styles suppressed */
      if(doc.style === 'cmd') {
        // overall footer
        doc.print(stream);
        doc.print(stream,
          util.format('%s@%s %s',
            data.name, data.version, path.dirname(__dirname)));
      }
    })
    .on('empty', function(help, version, req) {
      var stream = process.stdout;
      /* istanbul ignore else: always in test env */
      if(process.env.NODE_ENV === 'test') {
        stream = {
          write: function noop(){}
        } 
      }
      help.call(this, 'cmd', req, null, stream);
    })
    .on('complete', function(req) {
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

      if(!env.test && errors > 0) {
        process.exit(255); 
      }
    })
}

module.exports = function(pkg, name, description) {
  return new LinkDown(pkg, name, description);
}
