var fs = require('fs')
  , exec = require('child_process').exec
  , base = __dirname + '/guide'
  , tempfile = require('tempfile')
  , port = 8000
  , url = 'http://localhost:' + port
  , sections = [
    'configuration',
    'info',
    'ls',
    'validate'
  ]
  , commands = {
    info: [
      'linkdown info ' + url +  ' --bail'
    ],
    ls: [
      'linkdown ls ' + url +  ' --bail'
    ],
    validate: [
      'linkdown validate ' + url + ' --abort'
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
    if(commands[section]) {
      commands[section].forEach(function(cmd) {
        var tmp = tempfile('.example.log');
        var file = fs.openSync(tmp, 'w');
        var opts = {stdio: [0, file, file]};

        // command to execute
        console.log('```shell'); 
        console.log(cmd);
        console.log('```'); 
        console.log();

        //execSync('pwd', opts);
        exec(cmd, opts, function onExec(err, stdout, stderr) {
          //console.log('after command: '+ stdout);
          //console.log('after command: '+ stderr);

          //var contents = fs.readFileSync(tmp);

          process.stdout.write('```\n')
          process.stdout.write('' + stderr);
          process.stdout.write('```\n')

          fs.unlinkSync(tmp);

          console.log();

          onSection();
        })

      })
    }else{
      onSection();
    }
  }

  onSection();
});
