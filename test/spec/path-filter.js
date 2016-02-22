var expect = require('chai').expect
  , PathFilter = require('../../lib/path-filter');

describe('meta-parser:', function() {

  it('should compile patterns and filter paths', function(done) {
    var patterns = [
        '/section/foo',
        '!/section/.*'
      ]
      , paths = new PathFilter();

    paths.compile(patterns);

    expect(paths.include.length).to.eql(1);
    expect(paths.exclude.length).to.eql(1);
    expect(paths.include[0]).to.be.an.instanceof(RegExp);
    expect(paths.exclude[0]).to.be.an.instanceof(RegExp);

    expect(paths.filter('/section')).to.eql(true);
    expect(paths.filter('/section/bar')).to.eql(false);
    expect(paths.filter('/section/foo')).to.eql(true);

    done();
  });

  it('should error on missing pattern file', function(done) {
    var files = [
          'test/fixtures/non-existent-patterns.txt'
        ]
      , paths = new PathFilter();

    paths.load(files, function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/ENOENT/i);
      done();
    });
  });

  it('should error on bad pattern', function(done) {
    var files = [
          'test/fixtures/bad-pattern.txt'
        ]
      , paths = new PathFilter();

    paths.load(files, function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/nothing to repeat/i);
      done();
    });
  });

  it('should load patterns and filter paths', function(done) {
    var files = [
          'test/fixtures/pattern-1.txt',
          'test/fixtures/pattern-2.txt'
        ]
      , paths = new PathFilter();

    paths.load(files, function(err) {

      expect(err).to.eql(null);
    
      expect(paths.include.length).to.eql(1);
      expect(paths.exclude.length).to.eql(1);
      expect(paths.include[0]).to.be.an.instanceof(RegExp);
      expect(paths.exclude[0]).to.be.an.instanceof(RegExp);

      expect(paths.filter('/section')).to.eql(true);
      expect(paths.filter('/section/bar')).to.eql(false);
      expect(paths.filter('/section/foo')).to.eql(true);

      done();
    });
  });

});
