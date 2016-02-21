/**
 *  Prints output based on the --list-style option.
 */
function print(info, req, next, tree) {
  var k
    , Printer = require('./' + this.listStyle)
    , opts = {
        indent: this.indent,
        stdout: req.stdout
      }
    , printer = new Printer(opts)
    , depth;

  // recursive walk of node tree
  function walk(nodes) {
    for(var i = 0;i < nodes.length;i++) {

      // can't rely on crawl item depth property
      nodes[i].depth = depth; 

      printer.item(nodes[i]);
      if(nodes[i].nodes && nodes[i].nodes.length) {
        walk(nodes[i].nodes, ++depth); 
      }
    } 
    depth--;
  }

  // iterate hostname keys
  for(k in tree) {
    depth = tree[k].depth = 0;
    printer.open(k, tree[k]);

    // no need to walk the hierarchy list
    if(this.listStyle !== 'tty') {
      walk(tree[k].nodes);
      printer.close();
    }
  }
}

module.exports = print;