var expect = require('chai').expect
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv');

describe('linkdown:', function() {

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
