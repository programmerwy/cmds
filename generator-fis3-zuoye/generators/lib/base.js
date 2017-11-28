var Generator = require('yeoman-generator');
var fs = require('fs-extra');
var path = require('path');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }
    _private_err(err) {
        if (err) {
            this._private_clean();
            throw Error(err);
        }
    }
    _private_clean() {
        fs.removeSync(this.destinationRoot());
        console.log('dir cleaned');
    }
    _private_mkdir(dir, mode) {
        try {
            fs.mkdirSync(dir, mode);
            console.log(`   \x1b[32mcreate\x1b[0m [DIR]${dir}`);
        } catch (e) {
            if (e.errno === -2) {
                this._private_mkdir(path.dirname(dir), mode);
                this._private_mkdir(dir, mode);
            } else {
                this._private_err(e);
            }
        }
    }
    _private_mkdirs(arr) {
        arr.forEach(item => {
            this._private_mkdir(`${item}`, 0o755);
        });
    }
};