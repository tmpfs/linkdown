var expect = require('chai').expect
  , fs = require('fs')
  , archy = require('archy')
  , builder = require('../../lib/tree-builder');

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
 *    --cmd 'ldn meta' --json > test/fixtures/simple.json.log
 *
 *
 *  Build the mock fixture: 
 *
 *  NODE_ENV=devel ldn x http://localhost:8080 \
 *    --cmd 'ldn meta' --json > test/fixtures/mock.json.log
 */

describe('tree-builder:', function() {

  //it('should build simple tree', function(done) {
    //var input = load('test/fixtures/simple.json.log')
      //, res = builder(input)
      //, keys = Object.keys(res)
      //, host
      //, node;
    //expect(keys.length).to.eql(1);
    //host = res['localhost:8080'];
    //expect(host.label).to.be.a('string');
    //expect(host.nodes).to.be.an('array');
    //node = host.nodes[0];
    //expect(node).to.be.an('object');
    //expect(node.label).to.be.a('string').to.eql('Meta Page');
    //done();
  //});

  //it('should build simple tree w/ standard port', function(done) {
    //var input = load('test/fixtures/simple.json.log');
    //input[0].port = 443;
    //var res = builder(input)
      //, keys = Object.keys(res)
      //, host
      //, node;
    //expect(keys.length).to.eql(1);
    //host = res.localhost;
    //expect(host.label).to.be.a('string');
    //expect(host.nodes).to.be.an('array');
    //node = host.nodes[0];
    //expect(node).to.be.an('object');
    //expect(node.label).to.be.a('string').to.eql('Meta Page');
    //done();
  //});

  //it('should build simple tree w/ url label', function(done) {
    //var input = load('test/fixtures/simple.json.log');
    //delete input[0].meta;
    //var res = builder(input)
      //, keys = Object.keys(res)
      //, host
      //, node;
    //expect(keys.length).to.eql(1);
    //host = res['localhost:8080'];
    //expect(host.label).to.be.a('string');
    //expect(host.nodes).to.be.an('array');
    //node = host.nodes[0];
    //expect(node).to.be.an('object');
    //expect(node.label).to.be.a('string').to.eql(input[0].url);
    //done();
  //});

  //it('should build simple tree w/ hostMap', function(done) {
    //var input = load('test/fixtures/simple.json.log')
      //, hostMap = {'localhost:8080': 'example.com'}
      //, res = builder(input, {hostMap: hostMap})
      //, keys = Object.keys(res)
      //, host
      //, node;

    //expect(keys.length).to.eql(1);
    //host = res['example.com'];
    //expect(host.label).to.be.a('string');
    //expect(host.nodes).to.be.an('array');
    //node = host.nodes[0];
    //expect(node).to.be.an('object');
    //expect(node.label).to.be.a('string').to.eql('Meta Page');
    //done();
  //});

  it('should build mock tree', function(done) {
    var input = load('test/fixtures/mock.json.log')
      , res = builder(input, {lean: true})
      , keys = Object.keys(res)
      , host
      , node;
    expect(keys.length).to.eql(1);
    host = res['localhost:8080'];
    expect(host.label).to.be.a('string');
    expect(host.nodes).to.be.an('array');
    //console.dir(host.nodes.length);

    //host.nodes.forEach(function(node) {
      //console.log(node.label);
    //})

    console.dir(res, {depth: 4});

    console.log(archy(res['localhost:8080']));
    //node = host.nodes[0];
    //expect(node).to.be.an('object');
    //expect(node.label).to.be.a('string').to.eql('Meta Page');
    done();
  });

});
