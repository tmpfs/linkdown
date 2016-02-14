var fs = require('fs')
  , execSync = require('child_process').execSync
  , base = __dirname + '/guide'
  , tempfile = require('tempfile')
  , sections = [
    'configuration',
    'info',
    'validate'
  ]
  , commands = {
    info: [
      'linkdown info http://example.com'
    ],
    validate: [
      'linkdown validate http://example.com'
    ]
  }


sections.forEach(function(section) {
  var contents = '' + fs.readFileSync(base + '/' + section + '.md');
  process.stdout.write(contents);
  if(commands[section]) {
    commands[section].forEach(function(cmd) {
      var tmp = tempfile('.ansi');
      var file = fs.openSync(tmp, 'w');
      var opts = {stdio: [0, file, file]};

      // command to execute
      console.log('```shell'); 
      console.log(cmd);
      console.log('```'); 
      console.log();

      execSync(cmd, opts);

      var contents = fs.readFileSync(tmp);

      process.stdout.write('```\n')
      process.stdout.write('' + contents);
      process.stdout.write('```\n')

      fs.unlinkSync(tmp);

      console.log();
    })
  }
});