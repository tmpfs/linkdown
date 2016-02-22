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

  it('should error on invalid link type', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['tree', '--link=foo']);

    cli.program.on('error', function(err) {
      error.link(err, this.errors);
      done();
    })

    io.writable.write(input);
    cli.parse(args, {stdin: io.readable});
  });


  it('should print json tree', function(done) {
    output = 'target/tree.json';
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

    io.writable.on('finish', function() {
      cli.parse(args, {stdin: fs.createReadStream(io.readable.path)});
    })
    io.writable.write(input);
    io.writable.end();
  });

  it('should print json tree w/ --indent', function(done) {
    output = 'target/tree-indent.json';
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['tree', '-o=' + output, '--indent=2']);

    cli.program.on('complete', function() {
      var contents = '' + fs.readFileSync(output)
        , data = JSON.parse(contents)
        , lines = contents.trim().split('\n');
      //console.dir(lines);
      expect(lines.length).to.be.gt(1);
      simple(data);
      done();
    })

    io.writable.on('finish', function() {
      cli.parse(args, {stdin: fs.createReadStream(io.readable.path)});
    })
    io.writable.write(input);
    io.writable.end();
  });

  it('should print tree w/ --list-style=tty', function(done) {
    output = 'target/tree-tty.txt';
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['tree', '-o=' + output, '--list-style=tty']);

    cli.program.on('complete', function() {
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql('' + fs.readFileSync('test/fixtures/tty.txt'));
      done();
    })

    io.writable.on('finish', function() {
      cli.parse(args, {stdin: fs.createReadStream(io.readable.path)});
    })
    io.writable.write(input);
    io.writable.end();
  });

  it('should print tree w/ --list-style=tty and --labels', function(done) {
    output = 'target/tree-tty-labels.txt';
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['tree', '-o=' + output, '--list-style=tty', '--labels']);

    cli.program.on('complete', function() {
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(
        '' + fs.readFileSync('test/fixtures/tty-labels.txt'));
      done();
    })

    io.writable.on('finish', function() {
      cli.parse(args, {stdin: fs.createReadStream(io.readable.path)});
    })
    io.writable.write(input);
    io.writable.end();
  });

  it('should print tree w/ --list-style=html', function(done) {
    input = fs.readFileSync('test/fixtures/mock.log.json');
    output = 'target/html-list.txt';
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['tree', '-o=' + output, '--list-style=html']);

    cli.program.on('complete', function() {
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(
        '' + fs.readFileSync('test/fixtures/html-list.txt'));
      done();
    })

    io.writable.on('finish', function() {
      cli.parse(args, {stdin: fs.createReadStream(io.readable.path)});
    })
    io.writable.write(input);
    io.writable.end();
  });

  it('should print tree w/ --list-style=html and --indent=2', function(done) {
    input = fs.readFileSync('test/fixtures/mock.log.json');
    output = 'target/html-list-indent.txt';
    var cli = linkdown(pkg, pkg.name)
      , args = argv(
        ['tree', '-o=' + output, '--list-style=html', '--indent=2']);

    cli.program.on('complete', function() {
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(
        '' + fs.readFileSync('test/fixtures/html-list-indent.txt'));
      done();
    })

    io.writable.on('finish', function() {
      cli.parse(args, {stdin: fs.createReadStream(io.readable.path)});
    })
    io.writable.write(input);
    io.writable.end();
  });

  it('should print tree w/ --list-style=html and --link=absolute', 
    function(done) {
      input = fs.readFileSync('test/fixtures/mock.log.json');
      output = 'target/html-list-absolute.txt';
      var cli = linkdown(pkg, pkg.name)
        , args = argv(
          ['tree', '-o=' + output, '--list-style=html', '--link=absolute']);

      cli.program.on('complete', function() {
        var contents = '' + fs.readFileSync(output);
        expect(contents).to.eql(
          '' + fs.readFileSync('test/fixtures/html-list-absolute.txt'));
        done();
      })

      io.writable.on('finish', function() {
        cli.parse(args, {stdin: fs.createReadStream(io.readable.path)});
      })
      io.writable.write(input);
      io.writable.end();
    }
  );

  it('should print tree w/ --list-style=md', function(done) {
    input = fs.readFileSync('test/fixtures/mock.log.json');
    output = 'target/md-list.txt';
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['tree', '-o=' + output, '--list-style=md']);

    cli.program.on('complete', function() {
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(
        '' + fs.readFileSync('test/fixtures/md-list.txt'));
      done();
    })

    io.writable.on('finish', function() {
      cli.parse(args, {stdin: fs.createReadStream(io.readable.path)});
    })
    io.writable.write(input);
    io.writable.end();
  });

  it('should print tree w/ --list-style=md and --indent=4', function(done) {
    input = fs.readFileSync('test/fixtures/mock.log.json');
    output = 'target/md-list-indent.txt';
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['tree', '-o=' + output, '--list-style=md', '--indent=4']);

    cli.program.on('complete', function() {
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(
        '' + fs.readFileSync('test/fixtures/md-list-indent.txt'));
      done();
    })

    io.writable.on('finish', function() {
      cli.parse(args, {stdin: fs.createReadStream(io.readable.path)});
    })
    io.writable.write(input);
    io.writable.end();
  });

  it('should print tree w/ --list-style=md and --link=absolute',
    function(done) {
      input = fs.readFileSync('test/fixtures/mock.log.json');
      output = 'target/md-list-absolute.txt';
      var cli = linkdown(pkg, pkg.name)
        , args = argv(
            ['tree', '-o=' + output, '--list-style=md', '--link=absolute']);

      cli.program.on('complete', function() {
        var contents = '' + fs.readFileSync(output);
        expect(contents).to.eql(
          '' + fs.readFileSync('test/fixtures/md-list-absolute.txt'));
        done();
      })

      io.writable.on('finish', function() {
        cli.parse(args, {stdin: fs.createReadStream(io.readable.path)});
      })
      io.writable.write(input);
      io.writable.end();
    }
  );

  it('should print tree w/ --list-style=jade', function(done) {
    input = fs.readFileSync('test/fixtures/mock.log.json');
    output = 'target/jade-list.txt';
    var cli = linkdown(pkg, pkg.name)
      , args = argv(['tree', '-o=' + output, '--list-style=jade']);

    cli.program.on('complete', function() {
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(
        '' + fs.readFileSync('test/fixtures/jade-list.txt'));
      done();
    })

    io.writable.on('finish', function() {
      cli.parse(args, {stdin: fs.createReadStream(io.readable.path)});
    })
    io.writable.write(input);
    io.writable.end();
  });

  it('should print tree w/ --list-style=jade and --indent=4', function(done) {
    input = fs.readFileSync('test/fixtures/mock.log.json');
    output = 'target/jade-list-indent.txt';
    var cli = linkdown(pkg, pkg.name)
      , args = argv(
          ['tree', '-o=' + output, '--list-style=jade', '--indent=4']);

    cli.program.on('complete', function() {
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(
        '' + fs.readFileSync('test/fixtures/jade-list-indent.txt'));
      done();
    })

    io.writable.on('finish', function() {
      cli.parse(args, {stdin: fs.createReadStream(io.readable.path)});
    })
    io.writable.write(input);
    io.writable.end();
  });

  it('should print tree w/ --list-style=jade and --link=absolute',
    function(done) {
      input = fs.readFileSync('test/fixtures/mock.log.json');
      output = 'target/jade-list-absolute.txt';
      var cli = linkdown(pkg, pkg.name)
        , args = argv(
            ['tree', '-o=' + output, '--list-style=jade', '--link=absolute']);

      cli.program.on('complete', function() {
        var contents = '' + fs.readFileSync(output);
        expect(contents).to.eql(
          '' + fs.readFileSync('test/fixtures/jade-list-absolute.txt'));
        done();
      })

      io.writable.on('finish', function() {
        cli.parse(args, {stdin: fs.createReadStream(io.readable.path)});
      })
      io.writable.write(input);
      io.writable.end();
    }
  );


});
