var Generator = require('../lib/base');
var fs = require('fs-extra'),
    path = require('path');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }
    prompting() {
        return this.prompt([{
            type: 'input',
            name: 'name',
            message: 'Your project name',
            default: this.appname // Default to current folder name
        }, {
            type: 'name',
            name: 'cmnPrefix',
            message: 'Common-prefix your project relayed',
            default: ''
        }, {
            type: 'name',
            name: 'fis version',
            message: 'FIS version you use(fisp/fis3)',
            default: 'fis3'
        }]).then((answers) => {
            this.project = answers.name;
            this.cmnPrefix = answers.cmnPrefix;
        });
    }
    paths() {
        this.destinationRoot(this.project);
    }
    build() {
        var self = this;
        // mkdirs
        self._private_mkdirs(['config', 'page', 'static', 'test/page', 'widget']);
        // touch files
        fs.readdir(`${path.dirname(__dirname)}/app/resource`, 'utf-8', (err, files) => {
            self._private_err(err);
            files.forEach(item => {
                try {
                    var data = self.fs.read(`${path.dirname(__dirname)}/app/resource/${item}`);
                    if (item == 'map.json') {
                        self.fs.write(`config/${self.project}-map.json`, data);
                    } else {
                        self.fs.write(item,
                            data
                            .replace(/\${namespace}/g, self.project)
                            .replace(/\${common}/g, `${self.cmnPrefix || ''}common`)
                            .replace(/\${mcommon}/g, `${self.cmnPrefix || ''}mcommon`)
                        );
                    }
                } catch (e) {
                    self._private_err(e);
                }
            });
        });
    }
};