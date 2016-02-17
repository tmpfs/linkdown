var expect = require('chai').expect
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv')
  , error = require('../error');

describe('ls:', function() {

  it('should error on no url', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['ls']);
    cli.program.on('error', function(err) {
      error.url(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should error on invalid protocol', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['ls', '//example.com']);
    cli.program.on('error', function(err) {
      error.protocol(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should print discovered resources', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['ls', process.env.URL]);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

  it('should print discovered resources w/ --json', function(done) {
    console.dir(require('child_process').execSync('pwd && ls'));
    var cli = linkdown(pkg, pkg.name)
      , file = 'target/list.log'
      // add bail for faster tests
      , args = argv(['ls', process.env.URL, '--json', '-o=' + file]);
    cli.on('error', function(err) {
      console.dir(err); 
    })
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

});
