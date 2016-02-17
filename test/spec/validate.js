var expect = require('chai').expect
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv')
  , error = require('../error');

describe('validate:', function() {

  it('should error on no url', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['validate']);
    cli.program.on('error', function(err) {
      error.url(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should error on invalid protocol', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['validate', '//example.com']);
    cli.program.on('error', function(err) {
      error.protocol(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should error on missing jar', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['validate', process.env.URL, '--jar=non-existent.jar']);
    cli.program.on('error', function(err) {
      error.jar(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should error on invalid format', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['validate', process.env.URL, '--format=foo']);
    cli.program.on('error', function(err) {
      error.format(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should error on no jar available', function(done) {
    var jar = process.env.NU_VALIDATOR_JAR;
    delete process.env.NU_VALIDATOR_JAR;
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['validate', process.env.URL]);
    cli.program.on('error', function(err) {
      error.nojar(err, this.errors);
      process.env.NU_VALIDATOR_JAR = jar;
      done();
    })
    cli.parse(args);
  });

  it('should validate mock server', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['validate', process.env.URL]);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

  it('should validate mock server w/ --json', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , file = 'target/validate-json.log'
      , args = argv(['validate', process.env.URL, '--json', '-o=' + file]);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

  it('should validate mock server w/ --errors-only', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['validate', process.env.URL, '--errors-only']);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

  it('should validate mock server w/ --format', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , file = 'target/validate-xml.log'
      , args = argv(
          ['validate', process.env.URL, '--format=xml', '-o=' + file]);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

  it('should validate mock server w/ --format and --json', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , file = 'target/format-json.log'
      , args = argv(
          [
            'validate', process.env.URL,
            '--format=text', '--json', '-o=' + file]);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

  it('should adjust java thread stack size w/ -- -Xss512k', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['validate', process.env.URL, '--', '-Xss512k']);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
    cli.parse(args);
  });

  it('should abort validation w/ --abort', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['validate', process.env.URL, '--abort']);
    cli.program.once('error', function(err) {
      error.abort(err, this.errors);
      done();
    })
    cli.parse(args);
  });

  it('should abort validation w/ --format and --abort', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , file = 'target/test-abort.log'
      , args = argv(
        [
          'validate', process.env.URL,
          '--abort', '--format=xml', '-o=' + file]);
    cli.program.once('error', function(err) {
      error.abort(err, this.errors);
      done();
    })
    cli.parse(args);
  });

});
