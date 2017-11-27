import fs from 'fs';

const ROOTDIR = '/Users/shuolbde/myDir/gitShare/dev';
const INJECT = '\nvar $x = null;\n$x = \'code by wangyan01, test for cdn hijack ' + getDate() + '\';';

class Controller {
    constructor(args) {
        this.path = args.record[2];
        [this.realPath, this.namespace] = this.getRealPath();
    }
    getRealPath() {
        // eg: 
        // input https://ws-s.zuoyebang.cc/static/question/m-calculator/m-calculator_467b616.js
        // output /question/m-calculator/m-calculator
        var path = this.path.match(/.*zuoyebang\.cc\/static(\/.*)_(?=\w{7}.js$)/);
        path = path && path[1];
        var namespace = path.match(/(\/[^/]*)/);
        namespace = namespace && namespace[1];

        path = /widget/.test(path) ? path : path.replace(new RegExp(`(${namespace})`), '$1/static');

        return [
            ROOTDIR + path + '.js',       // realpath
            namespace
        ];
    }
    writeComplete(err, resolve) {
        var path = this.realPath,
            errStr = 'succ';
        if (err) {
            errStr = err;
        }
        // console.log('Saved: %s', this.namespace);
        resolve({
            errStr: errStr,
            namespace: this.namespace,
            path: path
        });
        
    }
    injectJs() {
        return new Promise((resolve, reject) => {
            fs.stat(this.realPath, (err, stat) => {
                if (err) {
                    resolve({
                        errStr: 'file is not exists',
                        namespace: this.namespace,
                        path: this.realPath
                    });
                } else {
                    fs.readFile(this.realPath, 'utf8', (err, content) => {
                        if (err) throw err;
                        if (/test for cdn hijack/.test(content)) {
                            fs.writeFile(this.realPath, content.replace(/(hijack\s)(\d{8})/, '$1' + getDate()), err => {
                                this.writeComplete(err, resolve);
                            });
                        } else {
                            fs.appendFile(this.realPath, INJECT, err => {
                                this.writeComplete(err, resolve);
                            });
                        }
                    });
                }
            });
        })
    }
}

function getDate() {
    var date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        month = month >= 10 ? month : '0' + month,
        day = date.getDate(),
        day = day >= 10 ? day : '0' + day;
    return [year, month, day].join('');
}

export default Controller;