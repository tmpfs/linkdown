var env = require('nenv')();

function argv(args, bypass) {
  if(!bypass) {
    args.push('--no-color');
    if(!env.debug) {
      args.push('--log-level=none'); 
    }
  }
  return args;
}

module.exports = argv;
