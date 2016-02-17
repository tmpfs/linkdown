var expect = require('chai').expect
  , fs = require('fs')
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv');

describe('info:', function() {

  it('should write report to disc', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , file = 'target/mock-report.json'
      , args = argv(
          ['info', process.env.URL, '--report=' + file]);
    cli.program.on('finish', function complete(/*res*/) {
      var contents = '' + fs.readFileSync(file)
        , report = JSON.parse(contents);
      expect(report).to.be.an('object');
      expect(report.length).to.be.a('number');
      expect(report.complete).to.be.a('number');
      expect(report.errors).to.be.a('number');
      expect(report.stats).to.be.an('object');
      expect(report.stats.headers).to.be.an('object');
      expect(report.stats.body).to.be.an('object');
      expect(report.stats.request).to.be.an('object');
      expect(report.stats.size).to.be.an('object');
      var fields = ['headers', 'body', 'request', 'size'];
      fields.forEach(function(field) {
        expect(report.stats[field].min).to.be.a('number');
        expect(report.stats[field].max).to.be.a('number');
        expect(report.stats[field].avg).to.be.a('number');
      })
      done(); 
    });
    cli.parse(args);
  });

});
