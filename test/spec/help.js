var expect = require('chai').expect
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv');

describe('linkdown:', function() {
  var stdout;

  beforeEach(function(done) {
    stdout = process.stdout.write;
    process.stdout.write = function noop(){}
    done();
  })

  afterEach(function(done) {
    process.stdout.write = stdout;
    done();
  })

  it('should print help with no arguments', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv([], true);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

});
