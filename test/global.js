process.env.PORT = process.env.PORT || 8080;
process.env.URL = process.env.URL || 'http://localhost:' + process.env.PORT;
// ensure we can find our own executables
process.env.PATH = './bin:' + process.env.PATH;
var server = require('./server/app');
before(function(done) {
  server.listen(process.env.PORT, function() {
    done();
  });
});
