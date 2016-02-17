var expect = require('chai').expect
  , fs = require('fs')
  , linkdown = require('../../lib/linkdown')
  , error = require('../error')
  , pkg = require('../../package.json')
  , argv = require('../argv');

describe('ls:', function() {

  it('should redirect stdout to output file', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , file = 'test/output.log'
      , args = argv(['ls', process.env.URL, '--json', '-o=' + file]);
    cli.program.on('finish', function complete(/*res*/) {
      expect(fs.existsSync(file)).to.eql(true);
      var contents = '' + fs.readFileSync(file)
        , lines = contents.trim().split('\n');
      lines.forEach(function(line) {
        expect(JSON.parse(line)).to.be.an('object');
      })
      done(); 
    });
    cli.parse(args);
  });

  it('should error when output file cannot be created', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['info', process.env.URL, '-o=/sbin/mock.log']);
    cli.program.on('error', function(err) {
      error.output(err, this.errors);
      done();
    })
    cli.parse(args);
  });

});
