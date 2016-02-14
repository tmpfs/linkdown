var fs = require('fs')
  , execSync = require('child_process').execSync
  , base = __dirname + '/guide'
  , tempfile = require('tempfile')
  , Convert = require('ansi-to-html')
  , convert = new Convert()
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

// initial heading
console.log('## Guide');
console.log('');

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

      execSync(cmd + ' --color', opts);

      var contents = fs.readFileSync(tmp);

      process.stdout.write('<pre><code>')
      process.stdout.write(convert.toHtml('' + contents));
      process.stdout.write('</code></pre>')

      fs.unlinkSync(tmp);

      console.log();
    })
  }
});
