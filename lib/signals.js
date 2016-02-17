var ansi = require('ttycolor').ansi;

/**
 *  Adds signal listeners so the crawl may be paused and resumed.
 */
function signals(crawler) {

  // TODO: use crawler.running - is it safe to use?
  var paused;

  // print start message
  function onStart() {
    paused = false;
    this.log.info(
      '[%s] started on %s',
      ansi(process.pid).blue,
      ansi(new Date()).yellow);
  }
  crawler.on('crawlstart', onStart.bind(this));

  /**
   *  Handle the stop signal, SIGHUP.
   */
  function stop(nm) {
    
    if(paused === false) {
      this.log.info(
        '[%s] stopped by %s at %s',
        ansi(process.pid).blue,
        ansi(nm).underline,
        ansi(new Date()).yellow);
      crawler.stop();
      // otherwise the process might exit
      process.stdin.resume();
    }else{
      this.log.warn('[%s] cannot stop from %s, already paused',
        ansi(process.pid).blue,
        ansi(nm).underline);
    }

    paused = true;
  }

  /**
   *  Handle the start signal, SIGCONT.
   */
  function start(nm) {
    if(paused === true) {
      this.log.info(
        '[%s] started by %s at %s',
        ansi(process.pid).blue,
        ansi(nm).underline,
        ansi(new Date()).yellow);
      crawler.start();
      // allow the process to exit
      process.stdin.pause();
    }else{
      this.log.warn('[%s] cannot start from %s, not paused',
        ansi(process.pid).blue,
        ansi(nm).underline);
    }

    // NOTE: the paused flag will be set in the `crawlstart` listener
  }

  process.on('SIGTSTP', stop.bind(this, 'TSTP'));
  process.on('SIGCONT', start.bind(this , 'CONT'));
}

module.exports = signals;
