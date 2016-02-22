var expect = require('chai').expect;

/**
 *  Assert on a program error.
 */
function err(key) {
  expect(key).to.be.a('string');
  return function onError(err, errors) {
    var def = errors[key];
    expect(def).to.be.an('object');
    expect(err).to.be.instanceof(Error);
    expect(err.key).to.eql(def.key);
    function fn() {
      throw err;
    }
    expect(fn).throws(Error);
  }
}

err.http = err('EHTTP_STATUS');

err.url = err('EURL');
err.protocol = err('EINVALID_PROTOCOL');
err.confload = err('ECONF_LOAD');

err.bail = err('EBAIL');
err.abort = err('EVALIDATE_ABORT');

err.nojar = err('ENU_VALIDATOR_JAR');
err.jar = err('ENOJAR');
err.java = err('EJAVA');
err.format = err('EINVALID_FORMAT');


err.pid = err('EPID');
err.output = err('EOUTPUT');

err.json = err('EJSON_PARSE');

err.style = err('ELIST_STYLE');
err.link = err('ELINK_TYPE');

module.exports = err;
