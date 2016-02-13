function argv(args, bypass) {
  if(!bypass) {
    args.push('--no-color');
    if(!process.env.DEBUG) {
      args.push('--log-level=none'); 
    }
  }
  return args;
}

module.exports = argv;
