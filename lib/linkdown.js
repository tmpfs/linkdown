var path = require('path')
  , util = require('util')
  , glue = require('cli-interface')
  , logger = require('cli-logger')
  , env = require('nenv')()
  , ttycolor = require('ttycolor')
  , summary = require('./summary')
  , report = require('./report')
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
      function onSummary(err, res) {
        /* istanbul ignore next: not going to mock this error */
        if(err) {
          return this.raise(err);
        }

        //console.dir(res);
        summary.print.call(this, res);
        
        function done() {
          /* istanbul ignore else: mock server always has errors */
          if(res.errors > 0) {
            var ex = this.wrap(this.errors.EHTTP_STATUS);
            // push to list for assertions
            req.errors.list.push(ex);

            // emit so we can assert on this error condition
            this.emit('finish', req);

            /* istanbul ignore next: always in test env */
            if(!env.test) {
              process.exit(ex.code); 
            }
          }
        }

        function onReport(err) {
          /* istanbul ignore next: not going to mock this io error */
          if(err) {
            return this.raise(err); 
          } 
          done.call(this);
        }

        if(this.report) {
          report(this.report, res, onReport.bind(this));
        }else{
          done.call(this);
        }

      }
      summary.call(this, req, onSummary.bind(this));
    })
}

module.exports = function(pkg, name, description) {
  return new LinkDown(pkg, name, description);
}
