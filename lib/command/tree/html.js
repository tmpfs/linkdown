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

function open(key, node) {
  this.stdout.write('<ul>');
  this.item(node);
}

function enter(node) {
  var indent = this.indent ? repeat(' ', this.indent * (node.depth + 1)) : '';
  if(this.indent) {
    this.stdout.write('\n'); 
  }
  this.stdout.write(indent + '<ul>');
}

function exit(node) {
  var indent = this.indent ? repeat(' ', this.indent * (node.depth + 1)) : '';

  if(this.indent) {
    this.stdout.write('\n'); 
  }
  this.stdout.write(indent + '</ul>');

  if(this.indent) {
    this.stdout.write('\n'); 
  }
  this.stdout.write(indent + '</li>');
}

function item(node) {
  var indent = this.indent ? repeat(' ', this.indent * (node.depth + 1)) : ''
    , link = indent + '<span>' + node.label + '</span>'
    , href = node.path;

  if(this.link === 'absolute') {
    href = node.url;
  }

  // NOTE: href might not be valid when crawling a deep url 
  // NOTE: with no parents
  if(href && this.link !== 'none') {
    link = indent + '<a href="' + href + '">' + node.label + '</a>';
  }

  if(this.indent) {
    this.stdout.write('\n'); 
  }

  this.stdout.write(indent + '<li>');

  if(this.indent) {
    this.stdout.write('\n'); 
  }

  this.stdout.write(link);

  if(this.description !== false && node.meta && node.meta.description) {
    this.stdout.write('<span>' + node.meta.description + '</span>');
  }

  if(!node.nodes.length) {
    if(this.indent) {
      this.stdout.write('\n'); 
    }
    this.stdout.write(indent + '</li>');
  }
}

function close() {
  if(this.indent) {
    this.stdout.write('\n'); 
  }
  this.stdout.write('</ul>');
}

Html.prototype.open = open;
Html.prototype.item = item;
Html.prototype.close = close;

Html.prototype.enter = enter;
Html.prototype.exit = exit;

module.exports = Html;
