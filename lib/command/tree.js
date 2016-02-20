//var builder = require('../tree-builder');

/**
 *  Reads the buffer on stdin and converts the line delimited JSON 
 *  documents into a tree representing the website structure.
 */
function tree(/*info, req, next*/) {
  var length = 0;

  function onReadable(size) {
    var data = process.stdin.read(size);
    if(data === null) {
      if(!length) {
        this.raise(this.errors.ESTDIN);
      }
    }else{
      length += size;
    }
  }
  process.stdin.on('readable', onReadable.bind(this));
}

module.exports = tree;
