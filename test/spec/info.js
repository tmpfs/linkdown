var expect = require('chai').expect
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json');

describe('linkdown:', function() {

  it('should print link summary', function(done) {
    var cli = linkdown(pkg)
      , args = ['info', '--no-color'];

    //cli.on('complete', function() {
      //console.log('completed');
      //done();
    //})

    cli.parse(args, function complete() {
      done(); 
    });
  });

});
