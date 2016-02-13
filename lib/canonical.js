function canonical(url, query) {
  var u = url.protocol + '://' + url.host;
  if(url.port !== '80' && url.port !== '443') {
    u += url.port; 
  }
  return u + (query ? url.path : url.uriPath);
}

module.exports = canonical;
