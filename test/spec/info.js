var expect = require('chai').expect
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv')
  , error = require('../error');

describe('info:', function() {

  it('should error on no url', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['info']);
    cli.program.on('error', function(err) {
      error.url(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should error on invalid protocol', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['info', '//example.com']);
    cli.program.on('error', function(err) {
      error.protocol(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should print link summary', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['info', process.env.URL]);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

  it('should print link summary w/ --json', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , file = 'target/info-json.log'
      , args = argv(['info', process.env.URL, '--json', '-o=' + file]);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

  it('should print link summary with --depth', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , file = 'target/info-depth.log'
      , args = argv(
          ['info', process.env.URL, '--json', '--depth=1', '-o=' + file]);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

});
