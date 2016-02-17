var re = {
  title: /<title>([^<]*)<\/title>/i,
  meta: /<meta name=["']([^"']+)["']\s*content=["']([^"']+)["']\s*\/?>/ig
}

/**
 *  Reads the buffer on stdin and extracts the meta data for HTML 
 *  pages.
 *
 *  Meta data includes:
 *
 *  - <title></title>
 *  - <meta name="description" content="description" />
 *  - <meta name="keywords" content="keywordsd" />
 */
function meta(info/*, req, next*/) {
  var buf = new Buffer(0)
    , args = info.args
    , doc = {};

  if(args.length) {
    try{
      doc = JSON.parse(info.args.join(' '));
    }catch(e) {
      // TODO: custom error?
      throw e;
    }
  }

  //process.stdout.write('HELLO');

  function onReadable(size) {
    var data = process.stdin.read(size); 
    if(data === null) {
      if(buf.length) {

        var str = buf.toString()
          , meta = {}
          , match;

        match = re.title.exec(str);
        if(match !== null) {
          meta.title = match[1];
        }

        while((match = re.meta.exec(str)) !== null) {
          meta[match[1]] = match[2];
        }

        doc.meta = meta;

        process.stdout.write(JSON.stringify(doc));
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
