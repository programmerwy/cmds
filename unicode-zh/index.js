#!/usr/bin/env node
'use strict';
var argv = require('yargs')
  .usage('Usage: unicode str')
  .example('unicode 哈哈', '\u54c8\u54c8')
  .help('h')
  .alias('h', 'help')
  .argv;

function convert(str) {
  return str.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function(match){
      return '\\u' + match.charCodeAt(0).toString(16);
  });
}

function pbcopy(data) {
  var proc = require('child_process').spawn('pbcopy');
  proc.stdin.write(data);
  proc.stdin.end();
}

!function() {
  if(!argv._[0]) {
    console.log('unicode-zh need an argv[手动微笑]');
    return false;
  }
  var output = convert(argv._[0]);
  pbcopy(output);
  console.log(output);
}();