var LineStream = require('stream-lines')
  , parse = require('./parse')
  , styles = ['md', 'html', 'jade', 'tty'];

/**
 *  Reads the buffer on stdin and converts the line delimited JSON 
 *  documents into a tree representing the website structure.
 */
function tree(info, req, next) {
  var length = 0
    , lines = new LineStream({buffer: true});

  if(this.listStyle && !~styles.indexOf(this.listStyle)) {
    this.raise(this.errors.ELIST_STYLE, [this.listStyle]) 
  }

  // TODO: handle combinations of args, ie: --archy with --list-style

  process.stdin.on('data', function(chunk) {
    length += chunk.length;
  })

  function onReadable(size) {
    var data = process.stdin.read(size); 
    if(data === null && !length) {
      this.raise(this.errors.ESTDIN);
    }
  }

  process.stdin.on('readable', onReadable.bind(this));

  process.stdin
    .pipe(lines)
    .on('finish', parse.bind(this, info, req, next, lines));
}

module.exports = tree;
