var fs = require('fs')
  , expect = require('chai').expect
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv')
  , stdin = require('../stdin')
  , input = fs.readFileSync('test/fixtures/simple.log.json')
  , output = 'target/tree-command.json'
  , error = require('../error');

/**
 *  Assert on simple tree.
 */
function simple(data) {
  var root = data['localhost:8080']
    , firstChild;

  expect(root).to.be.an('object');
  expect(root.label).to.eql('/');
  expect(root.pathname).to.eql('/');
  expect(root.label).to.eql('/');

  expect(root.nodes).to.be.an('array');
  expect(root.nodes.length).to.eql(1);

  firstChild = root.nodes[0];
  expect(firstChild.pathname).to.eql('/meta');
  expect(firstChild.label).to.eql('Meta Page');
  expect(firstChild.hostname).to.eql('localhost:8080');
  expect(firstChild.meta).to.be.an('object');
}

describe('tree:', function() {
  var io;

  beforeEach(function(done) {
    io = stdin();
    done();
  })

  it('should error on invalid list style', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['tree', '--list-style=foo']);

    cli.program.on('error', function(err) {
      error.style(err, this.errors);
      done();
    })

    io.writable.write(input);
    cli.parse(args, {stdin: io.readable});
  });

  it('should print json tree', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['tree', '-o=' + output]);

    cli.program.on('complete', function() {
      var contents = '' + fs.readFileSync(output)
        , data = JSON.parse(contents)
        , lines = contents.trim().split('\n');
      expect(lines.length).to.eql(1);
      simple(data);
      done();
    })

    io.writable.write(input);
    cli.parse(args, {stdin: io.readable});
  });

  it('should print json tree w/ --indent', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['tree', '-o=' + output, '--indent=2']);

    cli.program.on('complete', function() {
      var contents = '' + fs.readFileSync(output)
        , data = JSON.parse(contents)
        , lines = contents.trim().split('\n');
      expect(lines.length).to.be.gt(1);
      simple(data);
      done();
    })

    io.writable.write(input);
    cli.parse(args, {stdin: io.readable});
  });

});
