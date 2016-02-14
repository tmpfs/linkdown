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
      , args = argv(['validate', process.env.URL, '--format=xml']);
    cli.parse(args, function complete(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
  });

  //it('should print link summary with --depth', function(done) {
    //var cli = linkdown(pkg, pkg.name)
      //, args = argv(['info', process.env.URL, '--depth=1']);
    //cli.parse(args, function complete(res) {
      //expect(res.errors.list.length).to.eql(0);
      //done(); 
    //});
  //});

  //it('should ignore redirect with --no-follow', function(done) {
    //var cli = linkdown(pkg, pkg.name)
      //, args = argv(['info', process.env.URL, '--no-follow']);
    //cli.parse(args, function complete(res) {
      //expect(res.errors.list.length).to.eql(0);
      //done(); 
    //});
  //});


});
