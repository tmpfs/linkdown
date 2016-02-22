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

Hierarchy.prototype.open = open;

module.exports = Hierarchy;
