var linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv')
  , error = require('../error');

describe('info:', function() {

  it('should error on unknown log level', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(
          ['info', 'http://example.com', '--log-level=foo'], true);
    cli.program.on('error', function(err) {
      error.level(err, this.errors);
      done();
    })
    cli.parse(args);
  });

});
