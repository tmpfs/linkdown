module.exports = {
  validate: {
    fetch: {
      // this pattern will match the obvious file extensions
      // and treat directories as index pages so that they 
      // are also fetched
      pattern: /(\.(htm|html)|(\/))$/i
    }
  },
  crawl: {
    downloadUnsupported: false,
    userAgent: 'Linkdown',
    interval: 200,
    maxConcurrency: 25
  }
}
