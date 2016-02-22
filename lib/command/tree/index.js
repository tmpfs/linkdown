var LineStream = require('stream-lines')
  , parse = require('./parse')
  , styles = ['md', 'html', 'jade', 'tty']
  , links = ['none', 'relative', 'absolute']
  , sortable = ['label', 'path'];

/**
 *  Reads the buffer on stdin and converts the line delimited JSON 
 *  documents into a tree representing the website structure.
 */
function tree(info, req, next) {
  var length = 0
    , lines = new LineStream({buffer: true});

  if(this.listStyle && !~styles.indexOf(this.listStyle)) {
    return this.raise(
      this.errors.ELIST_STYLE, [this.listStyle, styles.join(', ')]);
  }

  if(this.link && !~links.indexOf(this.link)) {
    return this.raise(
      this.errors.ELINK_TYPE, [this.link, links.join(', ')]);
  }

  if(this.sort && !~sortable.indexOf(this.sort)) {
    return this.raise(
      this.errors.ESORT_TYPE, [this.sort, sortable.join(', ')]);
  }

  req.stdin.on('data', function(chunk) {
    length += chunk.length;
  })

  function onReadable(size) {
    var data = req.stdin.read(size); 
    /* istanbul ignore next: tough to mock */
    if(data === null && !length) {
      this.raise(this.errors.ESTDIN);
    }
  }

  req.stdin.on('readable', onReadable.bind(this));

  req.stdin
    .pipe(lines)
    .on('finish', parse.bind(this, info, req, next, lines));
}

module.exports = tree;
