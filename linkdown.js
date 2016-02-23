module.exports = {
  validate: {
    // only validate on these MIME types
    contentType: /(text\/html|application\/xhtml\+xml)/,
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
