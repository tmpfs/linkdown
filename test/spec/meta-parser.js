var expect = require('chai').expect
  , parser = require('../../lib/meta-parser');

describe('meta-parser:', function() {

  it('should parse title element', function(done) {
    var buf = new Buffer('<title>Mock Title</title>')
      , res = parser(buf);
    expect(res.title).to.eql('Mock Title');
    done();
  });

  it('should parse title element (string)', function(done) {
    var buf = '<title>Mock Title</title>'
      , res = parser(buf);
    expect(res.title).to.eql('Mock Title');
    done();
  });

  it('should parse title element and meta data', function(done) {
    var buf = '<title>Mock Title</title>\n'
        + '<meta name="description" content="Meta parser spec" />'
      , res = parser(buf);
    expect(res.title).to.eql('Mock Title');
    expect(res.description).to.eql('Meta parser spec');
    done();
  });

  it('should parse multiple meta elements', function(done) {
    var buf = '<meta name="description" content="Meta parser spec" />\n'
        + '<meta name="keywords" content="mock, test, spec" />\n'
      , res = parser(buf);
    expect(res.description).to.eql('Meta parser spec');
    expect(res.keywords).to.eql('mock, test, spec');
    done();
  });

});
