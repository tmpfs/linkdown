var LineStream = require('stream-lines')
  , builder = require('../tree-builder');

/**
 *  Helper to label the tree items, makes for more predictable
 *  assertions.
 */
function label(item, root){
  return root
    ? item.pathname + ' (' + item.hostname + ')' : '/' + item.name;
}

/**
 *  Reads the buffer on stdin and converts the line delimited JSON 
 *  documents into a tree representing the website structure.
 */
function tree(info, req, next) {
  var length = 0
    , lines = new LineStream({buffer: true});

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

  /**
   *  Parses the array of strings into an array of objects 
   *  ignoring empty lines and converts to a tree structure.
   */
  function parse() {
    var list = []
      , i
      , tree
      , opts = {};
    for(i = 0;i < lines.body.length;i++) {
      // ignore blank lines, often the last line
      if(lines.body[i]) {
        // let JSON.parse throw here
        list.push(JSON.parse(lines.body[i])); 
      }
    }

    if(this.labels) {
      opts.label = label; 
    }

    // build the tree
    tree = builder(list, opts);
   
    // print the result
    if(this.prettyPrint) {
      req.stdout.write(JSON.stringify(tree, undefined, 2) + '\n');
    }else if(this.hierarchy) {
      var archy = require('archy')
        , k
        , c = 0
        , result;
      for(k in tree) {
        result = archy(tree[k]);
        if(c) {
          req.stdout.write('\n'); 
        }
        req.stdout.write(result);
        c++;
      }
    }else{
      req.stdout.write(JSON.stringify(tree) + '\n');
    }
    next();
  }

  process.stdin
    .pipe(lines)
    .on('finish', parse.bind(this));
}

module.exports = tree;
