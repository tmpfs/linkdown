var url = require('url');

/**
 *  Accepts an array of JSON documents and builds a tree from 
 *  the array.
 */
function builder(items, opts) {
  opts = opts || {};
  var labelField = opts.labelField || 'label';
  var nodesField = opts.nodesField || 'nodes';
  opts.hostMap = opts.hostMap || {};

  var i
    , item
    , host
    , index
    , path
    , parts
    , map = {};

  // NOTE: must sort otherwise the tree is out of sync
  // NOTE: when a deep page comes before a page further up
  // NOTE: the hierarchy
  if(opts.sort) {
    items = items.sort(function(a, b) {
      if(a.url === b.url) {
        return 0; 
      } 
      return a.url > b.url ? 1 : -1;
    })
  }

  function addItem(nodes, item) {
    nodes.push(item); 
    return item;
  }

  function addToParent(host, parts, item) {
    var root = map[host]
      , nodes = root[nodesField]
      , i
      , part
      , pathname = ''
      , parent
      , j;

    function findParent() {
      // look in current nodes
      for(j = 0;j < nodes.length;j++) {
        if(nodes[j].pathname === pathname) {
          // ensure we have a nodes list
          nodes[j][nodesField] = nodes[j][nodesField] || [];
          nodes = nodes[j][nodesField];
          return nodes;
        }
      }
      return null;
    }

    function createParent() {
      var parent = addItem(nodes, getItem({pathname: pathname}))
      return parent.nodes;
    }

    // top-level
    if(parts.length === 1) {
      addItem(nodes, item); 
    }else{
      for(i = 0;i < parts.length;i++) {
        part = parts[i];
        pathname += '/' + part;

        // find or create parent hierarchy
        if(i < parts.length - 1) {
          parent = findParent();

          // parent node does not exist so create a new parent
          if(!parent) {
            nodes = createParent(pathname);
          }else{
            nodes = parent;
          }
        }else{
          addItem(nodes, item);
        }
      }
    }
  }

  function qualifiedHost(item) {
    var host = item.host;
    if(item.port !== 80 && item.port !== 443) {
      host += ':' + item.port;
    }
    if(opts.hostMap[host]) {
      return opts.hostMap[host];
    }
    return host;
  }

  function getItem(item, root) {
    if(!item.pathname) {
      item.pathname = url.parse(item.path).pathname;
    }

    var title = item.pathname
      , o;
    if(item.meta && item.meta.title) {
      title = item.meta.title; 
    }
    item[labelField] = title;
    item[nodesField] = item[nodesField] || [];

    var parts = item.pathname.split('/');
    item.name = parts.pop();

    if(typeof opts.label === 'function') {
      item[labelField] = opts.label(item, root);
    }

    // with lean we strip extraneous fields
    if(opts.lean) {
      o = {};
      o.pathname = item.pathname;
      o[labelField] = item[labelField];
      o[nodesField] = item[nodesField];
      return o;
    }

    return item;
  }

  for(i = 0;i < items.length;i++) {
    item = items[i];
    host = qualifiedHost(item);

    if(!item.path) {
      throw new Error('item must have path, maybe --json omitted'); 
    }

    // strip leading and trailing slashes from path before split
    path = item.path.replace(/^\/+/, '').replace(/\/+$/, '');

    // is the the index page (root) for the host
    index = path === '';

    parts = path.split('/');

    // inject the qualified hostname into all items
    item.hostname = host;

    // we must handle multiple hosts
    if(!map[host]) {

      // must have a root item for the tree even when no index page
      // is present
      map[host] = index
        ? getItem(item, true)
        : getItem({pathname: '/', hostname: host}, true);
    }

    if(index) {
      continue;
    }

    addToParent(host, parts, getItem(item));
  }

  // recursive sort of node tree
  function walk(nodes) {

    if(opts.sort) {
      nodes = nodes.sort(function(a, b) {
        var av = a[opts.sort]
          , bv = b[opts.sort];
        if(av === bv) {
          return 0; 
        }
        return av > bv ? 1 : -1;
      });
    }

    for(var i = 0;i < nodes.length;i++) {
      if(nodes[i].nodes && nodes[i].nodes.length) {
        walk(nodes[i].nodes);
      }
    } 
  }

  if(opts.sort) {
    for(var k in map) {
      walk(map[k].nodes); 
    } 
  }

  return map;
}

module.exports = builder;
