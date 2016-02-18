var parser = require('../meta-parser');

/**
 *  Reads the buffer on stdin and extracts the meta data for HTML 
 *  pages.
 */
function meta(info, req/*, next*/) {
  var buf = new Buffer(0)
    , args = info.args
    , doc = {};

  if(args.length) {
    try{
      doc = JSON.parse(info.args.join(' '));
    }catch(e) {
      // TODO: custom error? EJSON_PARSE maybe?
      throw e;
    }
  }

  function onReadable(size) {
    var data = process.stdin.read(size); 
    if(data === null) {
      if(buf.length) {
        doc.meta = parser(buf);
        req.stdout.write(JSON.stringify(doc) + '\n');
      }else{
        this.raise(this.errors.ESTDIN);
      }
    }else{
      buf = Buffer.concat([buf, data], buf.length + data.length);
    }
  }

  process.stdin.on('readable', onReadable.bind(this));
}

module.exports = meta;
