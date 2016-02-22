var expect = require('chai').expect
  , fs = require('fs')
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv')
  , error = require('../error');

describe('exec:', function() {

  it('should error on no url', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['exec']);
    cli.program.on('error', function(err) {
      error.url(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should error on invalid protocol', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['exec', '//example.com']);
    cli.program.on('error', function(err) {
      error.protocol(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should error on no command (--cmd)', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['exec', 'http://example.com']);
    cli.program.on('error', function(err) {
      error.cmd(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should execute external command', function(done) {
    var output = 'target/exec-cat.log';
    var cli = linkdown(pkg, pkg.name)
      , args = argv(
        [
          'exec', process.env.URL + '/meta', '--cmd', 'cat',
          '-o=' + output
        ]);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(
        '' + fs.readFileSync('test/fixtures/meta-page.html'));
      done(); 
    });
  });

  it('should execute external command w/ --json', function(done) {
    var output = 'target/exec-echo.log';
    var cli = linkdown(pkg, pkg.name)
      , args = argv(
        [
          'exec', process.env.URL + '/meta', '--cmd', 'echo',
          '-o=' + output, '--json'
        ]);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      var contents = '' + fs.readFileSync(output)
        , data = JSON.parse(contents);
      expect(data).to.be.an('object');
      expect(data.url).to.eql('http://localhost:8080/meta');
      done(); 
    });
  });


  it('should execute external command w/ arguments', function(done) {
    var output = 'target/exec-grep.log';
    var cli = linkdown(pkg, pkg.name)
      , args = argv(
        [
          'exec', process.env.URL + '/meta',
          '--cmd', 'grep --color=never meta',
          '-o=' + output
        ]);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(
        '' + fs.readFileSync('test/fixtures/meta-grep.txt'));
      done(); 
    });
  });

  it('should execute external command w/ -- (skip args)', function(done) {
    var output = 'target/exec-grep.log';
    var cli = linkdown(pkg, pkg.name)
      , args = argv(
        [
          'exec', process.env.URL + '/meta',
          '--cmd', 'grep',
          '-o=' + output,
          '--', '--color=never', 'meta'
        ]);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(
        '' + fs.readFileSync('test/fixtures/meta-grep.log'));
      done(); 
    });
  });

});
