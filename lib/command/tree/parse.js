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
    , print;

  //console.dir(lines.body.length);

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

  if(this.sort) {
    opts.sort = this.sort; 
  }

  if(this.pluck && this.pluck.length) {
    opts.pluck = this.pluck; 
  }

  // build the tree
  tree = builder(list, opts);

  /* istanbul ignore else: always print to file in tests */
  if(req.stdout !== process.stdout) {
    req.stdout.on('finish', next);
  }

  if(this.listStyle) {
    print = require('./list-print').bind(this, info, req, next, tree);
    return print();
  }else if(this.indent) {
    req.stdout.write(
      JSON.stringify(tree, undefined, this.indent) + '\n');
  }else{
    req.stdout.write(
      JSON.stringify(tree) + '\n');
  }

  /* istanbul ignore else: always print to file in tests */
  if(req.stdout !== process.stdout) {
    req.stdout.end();
  }else{
    next();
  }
}

module.exports = parse;
