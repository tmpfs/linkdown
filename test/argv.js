function argv(args, bypass) {
  if(!bypass) {
    args.push('--no-color');
    if(!process.env.DEBUG) {
      args.push('--silent'); 
    }
  }
  return args;
}

module.exports = argv;
