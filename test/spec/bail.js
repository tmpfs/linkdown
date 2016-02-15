var linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv')
  , error = require('../error');

describe('info:', function() {

  it('should abort processing on error with --bail', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['info', process.env.URL, '--bail']);
    cli.program.on('error', function(err) {
      error.bail(err, this.errors);
      done();
    })
    cli.parse(args);
  });

});
