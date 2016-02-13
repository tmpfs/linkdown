var path = require('path')
  , util = require('util')
  , glue = require('cli-interface')
  , logger = require('cli-logger')
  , env = require('nenv')()
  , styles = require('./styles')
  , pkg = require('../package.json')
  , base = path.normalize(path.join(__dirname, '..'))
  , ready = require('./ready')
  , beforeCommand = require('./before');

var LinkDown = function() {
  glue.apply(this, arguments);
  //console.log('new linkdown: ' + this.on);
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
      cache: true
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
  var opts = {level: logger.INFO, json: false, symbol: '|'};
  this
    .use(require('cli-mid-color'), {defaults: !env.test, styles: styles})
    .use(require('cli-mid-logger'), opts)
}

LinkDown.prototype.on = function() {
  this
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
}

module.exports = function(pkg, name, description) {
  return new LinkDown(pkg, name, description);
}
