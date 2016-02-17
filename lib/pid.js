var fs = require('fs')
  , pidfile;

/**
 *  Attempt to remove the pid file.
 */
/* istanbul ignore next: istanbul stops collecting coverage */
function onExit() {
  if(pidfile) {
    try{
      fs.unlinkSync(pidfile)
    }catch(e){}
  }
}

process.on('exit', onExit);

/**
 *  Write the process id to a file.
 */
function pid(file, cb) {
  pidfile = file;
  fs.writeFile(file, '' + process.pid, function(err) {
    return cb(err || null); 
  })
}

module.exports = pid;
