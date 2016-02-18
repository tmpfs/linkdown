var url = require('url');

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
    //, parent
    , index
    , path
    , parts
    //, part
    , nodes
    //, j
    , map = {};

  function addToParent(host, parts, item) {
    var root = map[host]
      , nodes = root[opts.nodesField]
      , i
      , part
      , pathname = ''
      , j;
    // top-level
    if(parts.length === 1) {
      nodes.push(item); 
    }else{

      //console.log('addToParent %j', parts.length);
      //console.log('addToParent %j', item.pathname);

      for(i = 0;i < parts.length;i++) {
        part = parts[i];
        pathname += '/' + part;

        // find or create parent hierarchy
        if(i < parts.length - 1) {

          // look in current nodes
          for(j = 0;j < nodes.length;j++) {
            if(nodes[j].pathname === pathname) {
              // ensure we have a nodes list
              nodes[j][opts.nodesField] = nodes[j][opts.nodeField] || [];
              nodes = nodes[j][opts.nodesField];
              break;
            }
          }

          // TODO: no match we need to create the parent hierarchy
        }else{
          nodes.push(item);
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

  function getItem(item) {
    var title = item.url
      , o;
    if(item.meta && item.meta.title) {
      title = item.meta.title; 
    }
    item[opts.labelField] = title;
    item[opts.nodesField] = item[opts.nodesField] || [];

    item.pathname = url.parse(item.path).pathname;

    // with lean we strip extraneous fields
    if(opts.lean) {
      o = {};
      o.pathname = item.pathname;
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

    addToParent(host, parts, getItem(item));

    //for(j = 0;j < parts.length;j++) {
      //part = parts[j];

      //if(!j) {
        //current = getItem(item);
      //}

      //if(j === (parts.length - 1)) {
        //nodes.push(current);
      //}

      //console.log('creating nodes on part %s', part);
      //nodes = current[opts.nodesField];
    //}
  }

  return map;
}

module.exports = builder;
