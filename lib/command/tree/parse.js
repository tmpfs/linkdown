var builder = require('../../tree-builder');

/**
 *  Helper to label the tree items, makes for more predictable
 *  assertions.
 */
function label(item, root){
  return root
    ? item.pathname + ' (' + item.hostname + ')' : '/' + item.name;
}

/**
 *  Parses the array of strings into an array of objects 
 *  ignoring empty lines and converts to a tree structure.
 */
function parse(info, req, next, lines) {
  var list = []
    , i
    , tree
    , opts = {}
    , print
    , indent
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

  indent = parseInt(this.indent) || 2;
 
  // print the result
  if(this.hierarchy) {
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
  }else if(this.listStyle) {
    print = require('./list-print').bind(this, info, req, next, tree);
    print();
  }else if(this.prettyPrint) {
    req.stdout.write(JSON.stringify(tree, undefined, indent) + '\n');
  }else{
    req.stdout.write(JSON.stringify(tree) + '\n');
  }
  next();
}

module.exports = parse;
