var fs = require('fs')
  , file = 'target/stdin.log';

function setup() {
  var writable = fs.createWriteStream(file, {flags: 'w'})
    , readable = {
      path: file
    }
  return {readable: readable, writable: writable};
}

module.exports = setup;
