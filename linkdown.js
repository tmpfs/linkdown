module.exports = {
  validate: {
    // time to sleep between validation calls
    // no sleep will get your fans going and pausing
    // a while gives a change to see the errors
    sleep: 5,
    fetch: {
      // this pattern will match the obvious file extensions
      // and treat directories with a trailing slash as index pages
      // so that they are also fetched
      file: /(\.(htm|html)|(\/))$/i,

      // this will catch paths without a trailing slash and no 
      // file extension, this pattern is negated in the fetch condition!
      directory: /\..+$/i
    }
  },
  crawl: {
    downloadUnsupported: false,
    userAgent: 'Linkdown',
    // decrease interval and concurrency as normally
    // executing against local server, adjust for your needs
    interval: 200,
    maxConcurrency: 25,
    // increase in case we have a slow validation (unlikely)
    listenerTTL: 30000
  }
}
