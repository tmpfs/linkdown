var server = require('./server/app');
before(function(done) {
  server.listen(process.env.PORT || 8080, function() {
    done();
  });
});
