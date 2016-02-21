var repeat = require('string-repeater');

/**
 *  Print a markdown list.
 */
function Markdown(opts) {
  this.opts = opts;
  this.indent = typeof opts.indent === 'number' ? opts.indent : 2;
  this.stdout = opts.stdout;
  this.link = opts.link;
  this.description = opts.description;
}

/**
 *  Open the root list.
 */
function open(key, node) {
  this.item(node);
}

/**
 *  Render a list item.
 */
function item(node) {
  var indent = repeat(' ', this.indent * node.depth)
    , link = node.label
    , href = node.path;

  if(this.link === 'absolute') {
    href = node.url;
  }

  // NOTE: href might not be valid when crawling a deep url 
  // NOTE: with no parents
  if(href && this.link !== 'none') {
    link = '[' + node.label + '](' + href + ')';
  }

  this.stdout.write(indent + '- ');
  this.stdout.write(link);

  if(this.description !== false && node.meta && node.meta.description) {
    this.stdout.write(' ' + node.meta.description);
  }

  this.stdout.write('\n');
}

/**
 *  Close the root list.
 */
function close() {}

Markdown.prototype.open = open;
Markdown.prototype.item = item;
Markdown.prototype.close = close;

module.exports = Markdown;
