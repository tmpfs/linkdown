var expect = require('chai').expect
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv');

describe('help:', function() {

  beforeEach(function(done) {
    process.env.CLI_TOOLKIT_SUPPRESS_HELP = 1;
    done();
  })

  afterEach(function(done) {
    delete process.env.CLI_TOOLKIT_SUPPRESS_HELP;
    done();
  })

  it('should print help ', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['-h'], true);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

});
