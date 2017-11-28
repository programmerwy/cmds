var Generator = require('../lib/base');
var fs = require('fs-extra');

const CONF = Object.freeze(require('./conf'));

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this._private_cmd();
    }
    paths() {
        this.destinationRoot();
    }
    build() {
        var self = this;
        if (self.options.del) {
            // del dirs
            self._private_del(self.options.del);
        } else {
            if (!self.options.name) {
                self._private_prompting().then(answers => {
                    self._private_init(answers);
                });
            } else {
                self._private_init(Object.assign({}, self.options));
            }
        }
    }
    end() {
        return ;
    }
    _private_init(conf) {
        var self = this;
        self.conf = conf;
        // mkdirs
        self._private_mkdirs([
            `${CONF.path.tpl}/${self.conf.name}`,
            `${CONF.path.static}/${self.conf.name}`,
            `${CONF.path.test}/${self.conf.name}`
        ]);
        // touch files
        var subPath = self.conf.name.replace(/^(.*)$/, '$1/$1');
        var comments = CONF.comment.map(item => {
            return item.replace(/\${([^}]*)}/g, (match, m1) => {
                return self.conf[m1];
            });
        });

        self.fs.write(`${CONF.path.tpl}/${subPath}.tpl`, comments[0]); // tpl
        self.fs.write(`${CONF.path.static}/${subPath}.less`, comments[1]); // less
        self.fs.write(`${CONF.path.static}/${subPath}.js`, comments[1]); // js
        self.fs.write(`${CONF.path.test}/${subPath}.json`, '{\n\t"result": {\n\t\n\t}\n}\n'); // json

    }
    _private_cmd() {
        this.argument('name', {
            desc: 'dir name',
            type: String,
            required: false
        });
        this.option('del', {
            alias: 'd',
            desc: 'del dir',
            type: String
        }).option('fileoverview', {
            alias: 'f',
            desc: 'overview of file',
            type: String,
            default: 'fileoverview'
        }).option('author', {
            alias: 'a',
            desc: 'author',
            type: String,
            default: this.config.get('author') || 'wangyan01'
        }).option('email', {
            alias: 'e',
            desc: 'email',
            type: String,
            default: this.config.get('email') || 'wangyan01@zuoyebang.com'
        }).option('corp', {
            alias: 'c',
            desc: 'corparation',
            type: String,
            default: this.config.get('corp') || 'Zuoyebang'
        });

        // save
        Object.entries(this.options).forEach(([ key, value ]) => {
            this.config.set(key, this.options[key]);
        })
        this.config.save();
    }
    _private_prompting() {
        return new Promise((resolve, reject) => {
            this.prompt([{
                type: 'input',
                name: 'name',
                message: 'Your dir name',
                default: this.appname // Default to current folder name
            }, {
                type: 'name',
                name: 'fileoverview',
                message: 'Fileoverview',
                default: 'fileoverview'
            }, {
                type: 'name',
                name: 'author',
                message: 'Author',
                default: 'wangyan01',
                store: true
            }, {
                type: 'name',
                name: 'email',
                message: 'Email',
                default: 'wangyan01@zuoyebang.com',
                store: true
            }]).then((answers) => {
                resolve(answers);
            })
        });
    }
    _private_clean() {
        fs.removeSync(`${CONF.path.tpl}/${this.conf.name}`);
        fs.removeSync(`${CONF.path.static}/${this.conf.name}`);
        fs.removeSync(`${CONF.path.test}/${this.conf.name}`);
        console.log('dir cleaned');
    }
    _private_del() {
        if (typeof this.options.del === 'string') {
            for (let dir in CONF.path) {
                var target = `${CONF.path[dir]}/${this.options.del}`;
                if (fs.existsSync(target)) {
                    try {
                        fs.removeSync(target);
                        console.log(`${target} deleted`);
                    } catch (e) {
                        this._private_err(e);
                    }
                } else {
                    console.log(`${target} is not exists`);
                }
            }
        } else {
            console.log('pls input dirname you want to del');
        }
        return;
    }
}