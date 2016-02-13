var ttycolor = require('ttycolor')
  , ansi = ttycolor.ansi
  , EOL = require('os').EOL;

function printResponse(item, buffer/*, response*/) {
  var status = item.stateData.code
    , success = status === 200 || status === 201
    , stream = process.stdout;

  if(!success) {
    stream = process.stdout; 
  }

  // status code
  stream.write(ansi(status)[success ? 'green' : 'red' ].valueOf());

  stream.write(EOL);

  //console.log('%s %s (%s bytes)',
    //item.stateData.code, item.url, buffer.length);
}

function before(info, req, next) {

  req.printResponse = printResponse.bind(this);

  //info.args = info.args.concat(req.patterns);
  next();
}

module.exports = before;
