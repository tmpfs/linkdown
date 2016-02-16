var env = require('nenv')();

function argv(args, bypass) {
  if(!bypass) {
    // NOTE: we don't want to push for the '--' usage
    args.unshift('--no-color');
    if(!env.debug) {
      args.unshift('--log-level=none'); 
    }
  }
  return args;
}

module.exports = argv;
