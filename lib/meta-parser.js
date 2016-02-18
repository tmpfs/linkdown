var re = {
  title: /<title>([^<]*)<\/title>/i,
  meta: /<meta name=["']([^"']+)["']\s*content=["']([^"']+)["']\s*\/?>/ig
}

/**
 *  Parse meta data from a buffer or string containing HTML markup.
 *
 *  Meta data includes the `title` element and all `meta` elements.
 *
 *  - <title></title>
 *  - <meta name="description" content="description" />
 *  - <meta name="keywords" content="keywords" />
 *
 *  @param buf {Buffer|String} The buffer to parse, converted to a string.
 *
 *  @return An object containing the meta data.
 */
function parse(buf) {
  if(Buffer.isBuffer(buf)) {
    buf = buf.toString(); 
  }

  var meta = {}
    , match;

  match = re.title.exec(buf);
  if(match !== null) {
    meta.title = match[1];
  }

  while((match = re.meta.exec(buf)) !== null) {
    meta[match[1]] = match[2];
  }

  return meta;
}

module.exports = parse;
