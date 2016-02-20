var repeat = require('string-repeater');

/**
 *  Print a markdown list.
 */
function Markdown(opts) {
  this.opts = opts;
  this.indent = opts.indent;
  this.stdout = opts.stdout;
}

function open(key, node) {
  this.item(node);
}

function item(node) {
  var depth = node.depth - 1
    , indent = repeat(' ', this.indent * depth);
  this.stdout.write(indent + '- ' + node.label + '\n');
}

function close() {}

Markdown.prototype.open = open;
Markdown.prototype.item = item;
Markdown.prototype.close = close;

module.exports = Markdown;
