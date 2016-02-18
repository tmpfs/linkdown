/**
 *  Accepts an array of JSON documents and builds a tree from 
 *  the array.
 */
function builder(items, opts) {
  opts = opts || {};
  opts.labelField = 'label';
  opts.nodesField = 'nodes';
  opts.hostMap = opts.hostMap || {};

  var i
    , item
    , current
    , host
    , index
    , path
    , parts
    , part
    , nodes
    , j
    , map = {};

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

  function getItem(item) {
    var title = item.url
      , o;
    if(item.meta && item.meta.title) {
      title = item.meta.title; 
    }
    item[opts.labelField] = title;
    item[opts.nodesField] = item[opts.nodesField] || [];

    // with lean we strip extraneous fields
    if(opts.lean) {
      o = {};
      o[opts.labelField] = item[opts.labelField];
      o[opts.nodesField] = item[opts.nodesField];
      return o;
    }

    return item;
  }

  for(i = 0;i < items.length;i++) {
    item = items[i];
    host = qualifiedHost(item);
    path = item.path;
    index = path === '/' || path === '';

    path = path.replace(/^\/+/, '');
    path = path.replace(/\/+$/, '');

    parts = path.split('/');

    // we must handle multiple hosts
    if(!map[host]) {
      map[host] = index ? getItem(item) : {}; 
      if(!index) {
        map[host][opts.labelField] = host;
      }
    }

    if(index) {
      continue;
    }

    current = map[host];
    nodes = current[opts.nodesField] = current[opts.nodesField] || [];

    for(j = 0;j < parts.length;j++) {
      part = parts[j];

      if(!j) {
        current = getItem(item);
      }

      if(j === (parts.length - 1)) {
        console.log('pushing nodes');
        nodes.push(current);
      }

      console.log('creating nodes on part %s', part);
      nodes = current[opts.nodesField];
    }
  }

  return map;
}

module.exports = builder;
