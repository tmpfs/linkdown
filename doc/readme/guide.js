var fs = require('fs')
  , spawn = require('child_process').spawn
  , base = __dirname + '/guide'
  , port = 8000
  , url = 'http://localhost:' + port
  , sections = [
    'configuration',
    'info',
    'ls',
    'exec',
    'meta',
    'validate'
  ]
  , commands = {
    info: [
      'linkdown info ' + url +  ' --bail'
    ],
    ls: [
      'linkdown ls ' + url +  ' --bail'
    ],
    exec: [
      'linkdown exec ' + url +  '/meta --cmd grep -- meta'
    ],
    meta: [
      'linkdown exec ' + url +  '/meta --cmd linkdown -- meta',
      'linkdown exec ' + url +  '/meta --cmd linkdown --json -- meta',
    ],
    validate: [
      'linkdown validate ' + url + '/validate-fail'
    ]
  }

var app = require('../../test/server/app');

app.listen(port, function() {

  process.stdout.write('' + fs.readFileSync('doc/readme/guide.md'));

  function onSection() {
    var section = sections.shift();
    if(!section) {
      process.exit();
    }
    var contents = '' + fs.readFileSync(base + '/' + section + '.md');
    process.stdout.write(contents);

    function onCommand() {
      var cmd = cmds.shift();
      if(!cmd) {
        return onSection();
      }
      var opts = {env: process.env};
      var parts = cmd.split(/\s+/);
      var exe = parts[0];
      var args = parts.slice(1);

      // command to execute
      console.log('```shell'); 
      console.log(cmd);
      console.log('```'); 
      console.log();

      var ps = spawn(exe, args, opts);
      // start code block
      process.stdout.write('```\n')

      // pipe streams
      ps.stdout.pipe(process.stdout);
      ps.stderr.pipe(process.stdout);

      ps.once('exit', function() {
        // close code block
        process.stdout.write('```\n\n')

        // process next command
        onCommand();
      })
    }

    if(commands[section]) {
      var cmds = commands[section].slice();

      onCommand();
    }else{
      onSection();
    }
  }

  onSection();
});
