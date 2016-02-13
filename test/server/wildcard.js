/**
 *  Wildcard 404 route to be added at the end of the routes before an 
 *  error handler.
 */
function wildcard(req, res, next) {
  var err = new Error('not_found');
  err.status = 404;
  next(err);
}

module.exports = wildcard;
