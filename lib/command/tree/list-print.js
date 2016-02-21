/**
 *  Prints output based on the --list-style option.
 */
function print(info, req, next, tree) {
  var k
    , Printer = require('./' + this.listStyle)
    , opts = {
        indent: this.indent,
        stdout: req.stdout,
        link: this.link || 'relative',
        description: this.listDescription
      }
    , printer = new Printer(opts)
    , depth
    , listStyle = this.listStyle
    , c = 0;

  // recursive walk of node tree
  function walk(nodes) {
    for(var i = 0;i < nodes.length;i++) {

      // can't rely on crawl item depth property
      nodes[i].depth = depth; 

      printer.item(nodes[i]);
      if(nodes[i].nodes && nodes[i].nodes.length) {

        if(typeof printer.enter === 'function') {
          printer.enter(nodes[i]);
        }
        walk(nodes[i].nodes, ++depth); 

        if(typeof printer.exit === 'function') {
          printer.exit(nodes[i]);
        }
      }
    } 
    depth--;
  }

  // iterate hostname keys
  for(k in tree) {
    depth = tree[k].depth = 0;

    if(c && (listStyle === 'tty' || listStyle === 'md')) {
      req.stdout.write('\n'); 
    }

    printer.open(k, tree[k]);

    // no need to walk the hierarchy list
    if(listStyle !== 'tty') {
      walk(tree[k].nodes);
      printer.close();
    }
    c++;
  }

}

module.exports = print;
