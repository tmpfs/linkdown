var expect = require('chai').expect
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv');

describe('linkdown:', function() {

  it('should error on no url', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['info']);
    cli.program.on('error', function(err) {
      expect(err).to.be.instanceof(Error);
      expect(err.code).to.be.a('number');
      expect(err.code).to.be.gt(0);
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

  it('should print link summary with --depth', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['info', process.env.URL, '--depth=1']);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

});
