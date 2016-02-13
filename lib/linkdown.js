var path = require('path')
  , util = require('util')
  , glue = require('cli-interface')
  , logger = require('cli-logger')
  , base = path.normalize(path.join(__dirname, '..'))
  , ready = require('./ready')
  , beforeCommand = require('./before');

var LinkDown = function() {
  glue.apply(this, arguments);
};

util.inherits(LinkDown, glue);

LinkDown.prototype.configure = function() {
  var file = path.join(__dirname, this.name() + '.md');
  var conf = {
    start: {
      time: new Date(),
      cwd: process.cwd()
    },
    stdin: true,
    trace: process.env.NODE_ENV === 'devel',
    error: {
      locales: path.join(__dirname, 'message', 'error'),
    },
    command: {
      dir: path.join(__dirname, 'command'),
      required: false,
      before: beforeCommand,
    },
    compiler: {
      input: [file],
      output: path.join(__dirname, this.name() + 'c.js'),
      cache: false
    },
    manual: {
      dir: path.join(base, 'doc', 'man'),
      dynamic: process.env.NODE_ENV === 'devel'
    },
    help: {
      width: 26
    },
    ready: ready,
  };
  this
    .configure(conf)
    .usage();
}

LinkDown.prototype.use = function() {
  var opts = {level: logger.INFO, json: false};
  this
    .use(require('cli-mid-color'))
    .use(require('cli-mid-logger'), opts)
}

LinkDown.prototype.on = function() {
  //var conf = this.configure();
  this
    .once('load', function(/*req*/) {
      this
        .use(require('cli-mid-manual'))
        .help('-h | --help')
        .version(null, null, 'Print version and exit');
    })
    .on('help:trailers', function ontrailers(doc, data, stream) {
      if(doc.style === 'cmd') {
        // overall footer
        doc.print(stream);
        doc.print(stream,
          util.format('%s@%s %s',
            data.name, data.version, path.dirname(__dirname)));
      }
    })
    .on('empty', function(help, version, req/*, next*/) {
      help.call(this, 'cmd', req);
    })
    .once('complete', function(/*req*/) {
      /* istanbul ignore if */
      if(process.env.NODE_ENV !== 'test') {
        process.exit(0);
      }
    })
}

module.exports = function(pkg, name, description) {
  return new LinkDown(pkg, name, description);
}
