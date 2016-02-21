var parser = require('../meta-parser');

/**
 *  Reads the buffer on stdin and extracts the meta data for HTML 
 *  pages.
 */
function meta(info, req, next) {
  var buf = new Buffer(0)
    , args = info.args
    , doc = {};

  if(args.length) {
    try{
      doc = JSON.parse(info.args.join(''));
    }catch(e) {
      return this.raise(this.errors.EJSON_PARSE, [e.message])
    }
  }

  function onReadable(size) {
    var data = req.stdin.read(size); 
    /* istanbul ignore if: tough to mock, run: `ldn meta` to verify */
    if(!buf.length && data === null) {
      this.raise(this.errors.ESTDIN);
    }else if(data !== null) {
      buf = Buffer.concat([buf, data], buf.length + data.length);
    }
  }

  req.stdin.on('close', function() {
    /* istanbul ignore else: tough to mock */
    if(buf.length) {
      doc.meta = parser(buf);
      req.stdout.write(JSON.stringify(doc) + '\n');
    }
    next();
  })

  req.stdin.on('readable', onReadable.bind(this));
}

module.exports = meta;
