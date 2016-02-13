var circular = require('circular')
  , EOL = require('os').EOL;

function print(doc, req, next) {
  process.stdout.write(circular.stringify(doc, 2) + EOL);
  next();
}

module.exports = print;
