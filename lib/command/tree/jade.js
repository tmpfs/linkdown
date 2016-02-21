var repeat = require('string-repeater');

/**
 *  Print a jade list.
 *
 *  @see http://jade-lang.com
 */
function Jade(opts) {
  this.opts = opts;
  this.indent = typeof opts.indent === 'number' ? opts.indent : 0;
  this.stdout = opts.stdout;
  this.link = opts.link;
  this.description = opts.description;
  this.depth = 0;
}

/**
 *  Write out a newline.
 */
function newline() {
  this.stdout.write('\n'); 
}

/**
 *  Helper to retrieve padding string.
 */
function pad(depth) {
  if(depth === undefined) {
    depth = this.depth; 
  }
  return this.indent ? repeat(' ', this.indent * depth) : '';
}

/**
 *  Open the root list.
 */
function open(key, node) {

  // open the root list
  this.stdout.write('ul');

  this.depth++;

  // primary node (index)
  this.item(node);
}

/**
 *  Enter child nodes.
 */
function enter(/*node*/) {
  this.depth++;
  this.newline();
  this.stdout.write(this.pad() + 'ul');
  this.depth++;
}

/**
 *  Exit child nodes.
 */
function exit(/*node*/) {
  this.depth--;
  //this.newline();
  //this.stdout.write(this.pad() + '</ul>');

  this.depth--;
  //this.newline();
  //this.stdout.write(this.pad() + '</li>');
}

/**
 *  Render a list item.
 */
function item(node) {
  var indent = this.pad()
    , child = this.pad(this.depth + 1)
    , link = child + 'span ' + node.label
    , href = node.path;

  if(this.link === 'absolute') {
    href = node.url;
  }

  // NOTE: href might not be valid when crawling a deep url 
  // NOTE: with no parents
  if(href && this.link !== 'none') {
    link = child + 'a(href="' + href + '") ' + node.label;
  }

  this.newline();
  this.stdout.write(indent + 'li');

  this.newline();
  this.stdout.write(link);

  if(this.description !== false && node.meta && node.meta.description) {
    this.newline();
    this.stdout.write(child + 'span ' + node.meta.description);
  }

  if(!node.nodes.length) {
    //this.newline();
    //this.stdout.write(indent + '</li>');
  }
}

/**
 *  Close the root list.
 */
function close() {
  this.depth--;
  //this.newline();
  //this.stdout.write('</ul>');
}

Jade.prototype.open = open;
Jade.prototype.item = item;
Jade.prototype.close = close;

Jade.prototype.enter = enter;
Jade.prototype.exit = exit;

Jade.prototype.newline = newline;
Jade.prototype.pad = pad;

module.exports = Jade;
