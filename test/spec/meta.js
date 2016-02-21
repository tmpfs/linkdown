var fs = require('fs')
  , expect = require('chai').expect
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv')
  , stdin = require('../stdin')
  , html = fs.readFileSync('test/fixtures/meta.html')
  , output = 'target/meta-command.json'
  , error = require('../error');

describe('meta:', function() {
  var io;

  beforeEach(function(done) {
    io = stdin();
    done();
  })

  it('should error on invalid json', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['meta', '-o=' + output, '{']);

    cli.program.on('error', function(err) {
      error.json(err, this.errors);
      done();
    })

    io.writable.write(html);
    cli.parse(args, {stdin: io.readable});
  });

  it('should extract meta data', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['meta', '-o=' + output]);

    cli.program.on('complete', function() {
      var contents = fs.readFileSync(output)
        , data = JSON.parse(contents);
      expect(data.meta).to.be.an('object');
      expect(data.meta.title)
        .to.be.a('string').to.eql('Page');
      expect(data.meta.description)
        .to.be.a('string').to.eql('Description');
      expect(data.meta.keywords)
        .to.be.a('string').to.eql('meta, parser');
      done();
    })

    io.writable.write(html);
    cli.parse(args, {stdin: io.readable});
  });

  it('should extract meta data into existing json object', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(
        ['meta', '-o=' + output, '{"url": "http://example.com"}']);

    cli.program.on('complete', function() {
      var contents = fs.readFileSync(output)
        , data = JSON.parse(contents);
      expect(data.url).to.eql('http://example.com');
      expect(data.meta).to.be.an('object');
      expect(data.meta.title)
        .to.be.a('string').to.eql('Page');
      expect(data.meta.description)
        .to.be.a('string').to.eql('Description');
      expect(data.meta.keywords)
        .to.be.a('string').to.eql('meta, parser');
      done();
    })

    io.writable.write(html);
    cli.parse(args, {stdin: io.readable});
  });

});
