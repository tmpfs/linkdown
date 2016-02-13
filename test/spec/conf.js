var expect = require('chai').expect
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv')
  , error = require('../error');

describe('linkdown:', function() {

  it('should error on missing conf file', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(
        ['info', process.env.URL, '-c=non-existent.js']);
    cli.program.on('error', function(err) {
      error.confload(err, this.errors);
      done();
    })
    cli.parse(args);
  });


  it('should use configuration file', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(
        ['info', process.env.URL, '-c=test/fixtures/mock-conf.js']);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

});
