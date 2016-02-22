var expect = require('chai').expect
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv')
  , error = require('../error');

describe('exec:', function() {

  it('should error on no url', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['exec']);
    cli.program.on('error', function(err) {
      error.url(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should error on invalid protocol', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['exec', '//example.com']);
    cli.program.on('error', function(err) {
      error.protocol(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should error on no command (--cmd)', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['exec', 'http://example.com']);
    cli.program.on('error', function(err) {
      error.cmd(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should execute external command', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(
        ['exec', process.env.URL + '/meta', '--cmd', 'cat']);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

  it('should execute external command w/ argument', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(
        [
          'exec', process.env.URL + '/meta',
          '--cmd', 'grep --color=never meta'
        ]);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

});
