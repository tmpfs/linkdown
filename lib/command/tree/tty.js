var archy = require('archy');

/**
 *  Print a hierarchy list.
 */
function Hierarchy(opts) {
  this.opts = opts;
  this.indent = opts.indent;
  this.stdout = opts.stdout;
}

function open(key, node) {
  this.stdout.write(archy(node));
}

function item(/*node*/) {}

function close() {}

Hierarchy.prototype.open = open;
Hierarchy.prototype.item = item;
Hierarchy.prototype.close = close;

module.exports = Hierarchy;
