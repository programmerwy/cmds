var Generator = require('yeoman-generator');
var fs = require('fs-extra'),
    path = require('path');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option('babel');
        this.argument('project', { type: String, required: true });
        this.argument('common', { type: String });
    }
    paths() {
        this.destinationRoot(this.options.project);
    }
    build() {
        var self = this;
        // mkdir
        self._private_mkdirs(['config', 'page', 'static', 'test/page', 'widget']);
        // touch files
        fs.readdir(`${path.dirname(__dirname)}/app/resource`, 'utf-8', (err, files) => {
            self._private_err(err);
            files.forEach(item => {
                try {
                    var data = self.fs.read(`${path.dirname(__dirname)}/app/resource/${item}`);
                    if (item == 'map.json') {
                        self.fs.write(`config/${self.options.project}-map.json`, data);
                    } else {
                        self.fs.write(item,
                            data
                            .replace(/\${namespace}/g, self.options.project)
                            .replace(/\${common}/g, `${self.options.common || ''}common`)
                            .replace(/\${mcommon}/g, `${self.options.common || ''}mcommon`)
                        );
                    }
                } catch (e) {
                    self._private_err(e);
                }
            });
        });
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
        } catch (e) {
            if (e.errno === 34) {
                this._private_mkdir(path.dirname(dir), mode);
                this._private_mkdir(dir, mode);
            }
        }
    }
    _private_mkdirs(arr) {
        var self = this;
        arr.forEach(item => {
            this._private_mkdir(`${item}`, 0o755);
        });
    }
};