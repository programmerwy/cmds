#!/usr/bin/env node
'use strict';
var fs = require('fs'),
  path = require('path'),
  argv = require('yargs')
    .option('d', {
      alias: 'del',
      describe: 'delete tpl suits',
      type: 'string'
    })
    .option('a', {
      alias: 'author',
      default: 'wangyan01',
      describe: 'author name in comment',
      type: 'string'
    })
    .option('e', {
      alias: 'email',
      default: 'wangyan01@zuoyebang.com',
      describe: 'email in comment',
      type: 'string'
    })
    .option('f', {
      alias: 'fileoverview',
      default: 'FILEOVERVIEW',
      describe: 'fileoverview in comment',
      type: 'string'
    })
    .usage('Usage: fisdir [options]')
    .example('fisdir pageName', 'pageName.tpl/less/js/json created!')
    .example('fisdir -d pageName', 'pageName.tpl/less/js/json deleted!')
    .help('h')
    .alias('h', 'help')
    .argv;

const DATE = new Date(),
  COMMENT = [
  '<!--\n * Copyright (c) 2014-' + DATE.getFullYear() + ' Zuoyebang, All rights reseved.\n * @fileoverview ' + argv.f + '\n * @author ' + argv.a + ' | ' + argv.e + '\n * @version 1.0 | ' + dateFormater(DATE) + ' | ' + argv.a + '   // 初始版本\n -->',
  '/**\n * Copyright (c) 2014-' + DATE.getFullYear() + ' Zuoyebang, All rights reseved.\n * @fileoverview ' + argv.f + '\n * @author ' + argv.a + ' | ' + argv.e + '\n * @version 1.0 | ' + dateFormater(DATE) + ' | ' + argv.a + '    // 初始版本。\n */'
],
  PATH = {
  tplPath: './page/',
  staticPath: './static/',
  testPath: './test/page/'
};

var myFs = {
  getFileName: function(property, dirname, pageName){
    var filename = null;
    switch(property){
      case 'tplPath':
        filename = dirname + pageName + '.tpl';
        break;
      case 'staticPath':
        filename = dirname + pageName; 
        break;
      case 'testPath':
        filename = dirname + pageName + '.json';
        break;
      default:
    }
    return filename;
  },
  addFile: function(filename){
    fs.open(filename, 'ax+', '0777', function(err, data){
      if(err){
        console.log(err);
      }else {
        console.log(filename + ' is created!');
      }
    });
  },
  delDir: function(path){
    if(fs.existsSync(path)){
      fs.readdirSync(path).forEach(function(file){
        var curPath = path + '/' + file;
        if(fs.statSync(curPath).isDirectory()){
          delDir(curPath);
        }else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdir(path, function(err){
        if(err){
          console.log(err);
        }else {
          console.log(path + ' is deleted!');
        }
      });
    }else {
      console.log(path + 'is not exists!');
    }
  },
  addComment: function(filename, comment){
    comment = comment || COMMENT;
    var extname = path.extname(filename);
    var buffer = /json/.test(extname) ? '' : (/tpl/.test(extname) ? comment[0] : comment[1]);
    buffer && fs.writeFile(filename, buffer, function(err, written, buffer){
      if(err) {
        console.log('write file err: ' + err);
      }
    });
  }
};

!function(){
  var isDel = !!argv.d;
  if(!isDel) {
    if(argv._[0]) {
      creates(argv._[0]);
    } else {
      console.log('pls input the pageName!');
      return;
    }
  } else if(argv.d){
    deletes(argv.d);
  } else {}
}();

function deletes(pageName){
  for(var property in PATH){
    var dirname = PATH[property] + pageName + '/';
    // var filename = myFs.getFileName(property, dirname, pageName);
    myFs.delDir(dirname);
  }
}

function creates(pageName){
  for(let property in PATH){
    let dirname = PATH[property] + pageName + '/';
    let filename = null;
    filename = myFs.getFileName(property, dirname, pageName);
    fs.exists(dirname, function(exists){
      if(exists){
        console.log(dirname + 'is already exists, pls check ur dir');
      }else {
        //创建文件夹
        fs.mkdir(dirname, '0777', function(){
          //判断为static资源
          if(!path.extname(filename)){
            myFs.addFile(filename + '.js');
            myFs.addComment(filename + '.js');

            myFs.addFile(filename + '.less');
            myFs.addComment(filename + '.less');
          }else {
            myFs.addFile(filename);
            myFs.addComment(filename);
          }
        });
      }
    });
  }
}

function dateFormater(dateObj){
  var month = dateObj.getMonth() + 1,
    month = month >= 10 ? month : '0' + month,
    date = dateObj.getDate(),
    date = date >= 10 ? date : '0' + date;
    return dateObj.getFullYear() + '-' + month + '-' + date;
  // ES7
  // return dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1).padStart(2, 0) + '-' + dateObj.getDate().padStart(2, 0);
}
//在server.conf中添加一条template
function appendInConf(){}