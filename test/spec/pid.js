var expect = require('chai').expect
  , fs = require('fs')
  , linkdown = require('../../lib/linkdown')
  , error = require('../error')
  , pkg = require('../../package.json')
  , argv = require('../argv');

describe('info:', function() {

  it('should write pid file to disc', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , file = 'target/test.pid'
      , args = argv(
          ['info', process.env.URL, '--pid=' + file]);
    cli.program.on('finish', function complete(/*res*/) {
      expect(fs.existsSync(file)).to.eql(true);
      var contents = '' + fs.readFileSync(file);
      expect(parseInt(contents)).to.eql(process.pid);
      done(); 
    });
    cli.parse(args);
  });

  it('should error when pid file cannot be created', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['info', process.env.URL, '--pid=/sbin/mock.pid']);
    cli.program.on('error', function(err) {
      error.pid(err, this.errors);
      done();
    })
    cli.parse(args);
  });
});
