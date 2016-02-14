module.exports = {
  validate: {
    contentType: /(text\/html|application\/xhtml\+xml)/,
    // time to sleep between validation calls
    // no sleep will get your fans going and pausing
    // a while gives a chance to see the errors
    sleep: {
      pass: 0.5,
      fail: 5
    },
    fetch: {
      // this pattern will match the obvious file extensions
      // and treat directories with a trailing slash as index pages
      // so that they are also fetched
      file: /(\.(htm|html|xhtml|xht)|(\/))$/i,

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
    maxConcurrency: 25
  }
}
