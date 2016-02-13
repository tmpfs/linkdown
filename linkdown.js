module.exports = {
  validate: {
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
    interval: 200,
    maxConcurrency: 25
  }
}
