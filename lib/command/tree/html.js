var repeat = require('string-repeater');

/**
 *  Print an HTML list.
 */
function Html(opts) {
  this.opts = opts;
  this.indent = typeof opts.indent === 'number' ? opts.indent : 0;
  this.stdout = opts.stdout;
  this.link = opts.link;
  this.description = opts.description;
}

function newline() {
  if(this.indent) {
    this.stdout.write('\n'); 
  }
}

function open(key, node) {
  this.stdout.write('<ul>');
  this.item(node);
}

function enter(node) {
  var indent = this.indent ? repeat(' ', this.indent * (node.depth + 2)) : '';
  this.newline();
  //node.nodes.forEach(function(node) {
    //node.depth = node.depth + 2;
  //})
  this.stdout.write(indent + '<ul>');
}

function exit(node) {
  var indent = this.indent ? repeat(' ', this.indent * (node.depth + 1)) : ''
    , child = this.indent ? repeat(' ', this.indent * (node.depth + 2)) : '';

  this.newline();
  this.stdout.write(child + '</ul>');

  this.newline();
  this.stdout.write(indent + '</li>');
}

function item(node) {
  var indent = this.indent ? repeat(' ', this.indent * (node.depth + 1)) : ''
    , child = this.indent ? repeat(' ', this.indent * (node.depth + 2)) : ''
    , link = child + '<span>' + node.label + '</span>'
    , href = node.path;

  if(this.link === 'absolute') {
    href = node.url;
  }

  // NOTE: href might not be valid when crawling a deep url 
  // NOTE: with no parents
  if(href && this.link !== 'none') {
    link = child + '<a href="' + href + '">' + node.label + '</a>';
  }

  this.newline();
  this.stdout.write(indent + '<li>');

  this.newline();
  this.stdout.write(link);

  if(this.description !== false && node.meta && node.meta.description) {
    this.newline();
    this.stdout.write(child + '<span>' + node.meta.description + '</span>');
  }

  if(!node.nodes.length) {
    this.newline();
    this.stdout.write(indent + '</li>');
  }
}

function close() {
  this.newline();
  this.stdout.write('</ul>');
}

Html.prototype.open = open;
Html.prototype.item = item;
Html.prototype.close = close;

Html.prototype.newline = newline;
Html.prototype.enter = enter;
Html.prototype.exit = exit;

module.exports = Html;
