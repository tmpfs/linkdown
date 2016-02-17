var expect = require('chai').expect
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv')
  , error = require('../error');

describe('info:', function() {

  it('should handle non-existent server', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['info', 'http://localhost:9871']);
    cli.program.on('finish', function complete(res) {
      expect(res.errors.list.length).to.eql(1);
      error.http(res.errors.list[0], this.errors);
      done(); 
    });
    cli.parse(args);
  });

});
