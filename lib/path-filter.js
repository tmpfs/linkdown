var fs = require('fs');

/**
 *  Encapsulates the path filter regular expression patterns.
 */
function PathFilter(opts) {
  opts = opts || {};
  this.flags = opts.flags || 'ig';
  this.include = [];
  this.exclude = [];
}

/**
 *  Compile an array of regular expression strings.
 *
 *  If a pattern is prefixed with ! it is an exclude pattern.
 *
 *  @param patterns {Array} Array of string patterns.
 */
function compile(patterns) {
  var i
    , re
    , ptn
    , exclude;
  for(i = 0;i < patterns.length;i++) {
    ptn = patterns[i];
    exclude = /^!/.test(ptn);

    // strip the ! prefix for exclude patterns
    if(exclude) {
      ptn = ptn.substr(1);
    }

    // throw on pattern compile error
    re = new RegExp(ptn, this.flags); 

    if(exclude) {
      this.exclude.push(re);
    }else{
      this.include.push(re);
    }
  }
}

/**
 *  Load and compile files containing newline delimited patterns.
 *
 *  @param files {Array} List of files to load and compile.
 *  @param cb {Function} Callback function.
 */
function load(files, cb) {
  var patterns = []
    , scope = this;

  function done(err) {
    if(!err) {
      try {
        scope.compile(patterns);
      }catch(e) {
        return cb(e); 
      }
    } 
    cb(err || null);
  }

  function next() {
    var file = files.shift();
    if(!file) {
      return done(); 
    }

    fs.readFile(file, 'utf8', function(err, contents) {
      if(err) {
        return done(err); 
      } 

      contents = '' + contents;
      var lines = contents.split(/\r?\n/);

      // strip comment lines and empty lines
      lines = lines.filter(function(line) {
        if(/^\s*#/.test(line)) {
          return false; 
        }
        return line; 
      })

      patterns = patterns.concat(lines);
      next();
    })
  }

  next();
}

/**
 *  Compare a path to the patterns.
 *
 *  @param path {String} The path to filter.
 */
function filter(path) {
  var i
    , re;

  for(i = 0;i < this.include.length;i++) {
    re = this.include[i];
    re.lastIndex = 0;
    if(re.test(path)) {
      return true; 
    }
  }

  for(i = 0;i < this.exclude.length;i++) {
    re = this.exclude[i];
    re.lastIndex = 0;
    if(re.test(path)) {
      return false; 
    }
  }

  return true;
}

PathFilter.prototype.compile = compile;
PathFilter.prototype.load = load;
PathFilter.prototype.filter = filter;

module.exports = PathFilter;
