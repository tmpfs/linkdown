var archy = require('archy');

/**
 *  Print a hierarchy list.
 */
function Hierarchy(opts) {
  this.opts = opts;
  this.indent = opts.indent;
  this.stdout = opts.stdout;
}

/**
 *  Open the root list.
 */
function open(key, node) {
  this.stdout.write(archy(node));
}

/**
 *  Render a list item.
 */
function item(/*node*/) {}

/**
 *  Close the root list.
 */
function close() {}

Hierarchy.prototype.open = open;
Hierarchy.prototype.item = item;
Hierarchy.prototype.close = close;

module.exports = Hierarchy;
