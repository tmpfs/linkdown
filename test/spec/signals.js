var expect = require('chai').expect
  , linkdown = require('../../lib/linkdown')
  , pkg = require('../../package.json')
  , argv = require('../argv');

describe('signals:', function() {

  it('should pause and resume crawl on signals', function(done) {
    var cli = linkdown(pkg, pkg.name)
      , args = argv(
          ['info', process.env.URL]);
    cli.parse(args, function(res) {
      expect(res.errors.list.length).to.eql(0);
      done(); 
    });
    function pause() {
      process.kill(process.pid, 'SIGTSTP');
      // send twice to trigger code path
      process.kill(process.pid, 'SIGTSTP');
      setTimeout(resume, 250);
    }
    function resume() {
      process.kill(process.pid, 'SIGCONT');
      // send twice to trigger code path
      process.kill(process.pid, 'SIGCONT');
    }
    setTimeout(pause, 250);
  });
});
