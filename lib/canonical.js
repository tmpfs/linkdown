function canonical(url, query) {
  var u = url.protocol + '://' + url.host;

  /* istanbul ignore else: not going to mock privileged port */
  if(url.port !== '80' && url.port !== '443') {
    u += url.port; 
  }

  /* istanbul ignore next: not currently using query */
  return u + (query ? url.path : url.uriPath);
}

module.exports = canonical;
