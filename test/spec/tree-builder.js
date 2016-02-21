var expect = require('chai').expect
  , fs = require('fs')
  //, archy = require('archy')
  , builder = require('../../lib/tree-builder');


/**
 *  Helper to label the tree items, makes for more predictable
 *  assertions.
 */
function label(item, root){
  return root
    ? item.pathname + ' (' + item.hostname + ')' : '/' + item.name;
}

/**
 *  Helper to load the mock fixtures.
 */
function load(file) {
  var contents = '' + fs.readFileSync(file)
    , lines = contents.trim().split('\n');
  return lines.map(function(line) {
    if(line) {
      return JSON.parse(line);
    }
    return false;
  })
}

/**
 *  Server must be running: `npm start`.
 *
 *  Build the simple fixture: 
 *
 *  NODE_ENV=devel ldn x http://localhost:8080/meta \
 *    --cmd 'ldn meta' --json > test/fixtures/simple.log.json
 *
 *  Build the deep fixture:
 *
 *  NODE_ENV=devel ldn x http://localhost:8080/into/the/deep \
 *    --cmd 'ldn meta' --json > test/fixtures/deep.log.json
 *
 *  Build the mock fixture: 
 *
 *  NODE_ENV=devel ldn x http://localhost:8080 \
 *    --cmd 'ldn meta' --json > test/fixtures/mock.log.json
 */
describe('tree-builder:', function() {

  it('should build simple tree', function(done) {
    var input = load('test/fixtures/simple.log.json')
      , res = builder(input)
      , keys = Object.keys(res)
      , host
      , node;
    expect(keys.length).to.eql(1);
    host = res['localhost:8080'];
    expect(host.label).to.be.a('string');
    expect(host.nodes).to.be.an('array');
    node = host.nodes[0];
    expect(node).to.be.an('object');
    expect(node.label).to.be.a('string').to.eql('Meta Page');
    done();
  });

  it('should build simple tree w/ standard port', function(done) {
    var input = load('test/fixtures/simple.log.json');
    input[0].port = 443;
    var res = builder(input)
      , keys = Object.keys(res)
      , host
      , node;
    expect(keys.length).to.eql(1);
    host = res.localhost;
    expect(host.label).to.be.a('string');
    expect(host.nodes).to.be.an('array');
    node = host.nodes[0];
    expect(node).to.be.an('object');
    expect(node.label).to.be.a('string').to.eql('Meta Page');
    done();
  });

  it('should build simple tree w/ hostMap', function(done) {
    var input = load('test/fixtures/simple.log.json')
      , hostMap = {'localhost:8080': 'example.com'}
      , res = builder(input, {hostMap: hostMap})
      , keys = Object.keys(res)
      , host
      , node;

    expect(keys.length).to.eql(1);
    host = res['example.com'];
    expect(host.label).to.be.a('string');
    expect(host.nodes).to.be.an('array');
    node = host.nodes[0];
    expect(node).to.be.an('object');
    expect(node.label).to.be.a('string').to.eql('Meta Page');
    done();
  });
  
  it('should build tree with no parents', function(done) {
    var input = load('test/fixtures/deep.log.json')
      , res = builder(input, {lean: true, label: label})
      , keys = Object.keys(res)
      , host
      , node;
    expect(keys.length).to.eql(1);
    host = res['localhost:8080'];
    expect(host.label).to.be.a('string')
      .to.eql('/ (localhost:8080)');

    expect(host.nodes).to.be.an('array');

    node = host.nodes[0];
    expect(node.label).to.eql('/into');

    node = node.nodes[0];
    expect(node.label).to.eql('/the');

    node = node.nodes[0];
    expect(node.label).to.eql('/deep');

    //console.dir(res, {depth: 4});
    //console.log(archy(res['localhost:8080']));

    done();
  });


  it('should build full tree', function(done) {
    var input = load('test/fixtures/mock.log.json')
      , res = builder(input, {lean: true, label: label})
      , keys = Object.keys(res)
      , host
      , node;
    expect(keys.length).to.eql(1);
    host = res['localhost:8080'];
    expect(host.label).to.be.a('string')
      .to.eql('/ (localhost:8080)');

    expect(host.nodes).to.be.an('array');

    node = host.nodes[0];
    expect(node.label).to.eql('/meta');

    //console.dir(res, {depth: 4});
    //console.log(archy(res['localhost:8080']));

    done();
  });

});
