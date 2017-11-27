fis.require('smarty')(fis);

// 目前 fis3-smarty 要求至少设置个 namespace
fis.set('namespace', '${namespace}');

fis.match('*.less', {
    // fis-parser-zuoye-less 插件进行解析
    parser: fis.plugin('zuoye-less'),
    // .less 文件后缀构建后被改成 .css 文件
    rExt: '.css'
});

fis.match('*.js', {
    // useHash: false,
    optimizer: false,
    parser: fis.plugin('zuoye-babel-6.x')
});

// default media is `dev`，
fis.media('dev')
    .match('*.tpl', {
        optimizer: fis.plugin('html-compress', {
            level: 'strip_comment'
        })
    })
    .match('*', {
        deploy: fis.plugin('local-deliver', {
            // to 应配置成开发人员自己的 `fisp server open` 所在目录
            // 同时使用 `fis3 server start -p [port] --root [to对应的路径]` 来使用 fisp 的根目录作为 fis3 server 的启动目录
            // fis3 server 启动时会占用根目录写权限，可能会导致 fisp server 写目录时受阻，待解决，请知晓 :-)
            to: '/Users/shuolbde/.fis-plus-tmp/www'
        })
    });

// 生产环境
fis.media('prod')
    .match('::package', {
        packager: fis.plugin('map', {})
    })
    .match('!*.{html,tpl}', {
        useHash: true
    })
    .match('*-map.json', {
        release: '/config/$0',
        useHash: false
    })
    .match('*.tpl', {
        optimizer: fis.plugin('html-compress', {
            level: 'strip_comment'
        })
    })
    .match('*.js', {
        optimizer: fis.plugin('uglify-js')
    })
    .match('*.less', {
        optimizer: fis.plugin('clean-css')
    })
    .match('*.{css,js,png,jpg,bmp,gif,less}', {
        // domain: 'https://yy-s.zuoyebang.cc'
    });

// deploy ///////////////////////////////////////////////////////////////
var deployConfig = [{
    from: '/page/**', // 模板
    to: '/home/homework'
}, {
    from: '/static/**', // 静态资源
    to: '/home/homework/webroot'
}, {
    from: '/widget/**/*', // widget
    to: '/home/homework/webroot'
}, {
    from: '/widget/**/*.tpl', // widget
    to: '/home/homework'
}, {
    from: '/config/**', // config
    to: '/home/homework/data/smarty'
}, {
    from: '/plugin/**', // plugin
    to: '/home/homework/php/phplib/ext/smarty/baiduplugins',
    subOnly: true
}];

var deployTargets = {
    kdzy12: {
        host: '172.30.132.12',
        user: 'rd'
    }
};

fis.util.map(deployTargets, function(serverName, serverConfig) {
    var _deployConfig = fis.util.clone(serverConfig.deploy || deployConfig.map(function(item) {
        // 区分测试机用户目录 /home/homework  or /home/rd
        return fis.util.merge({
            to: item.to.replace(/homework/, serverConfig.user || 'homework')
        }, item);
    }));

    for (var i = 0; i < _deployConfig.length; i++) {
        var _deploy = _deployConfig[i];
        fis.media(serverName).match('*-map.json', {
            release: '/config/$0',
            deploy: fis.plugin('http-push', {
                receiver: 'http://' + serverConfig.host + ':8020/fisreceiver.php',
                to: '/home/homework/data/smarty'.replace(/homework/, serverConfig.user || 'homework')
            })
        }).match(_deploy.from, {
            deploy: fis.plugin('http-push', {
                receiver: 'http://' + serverConfig.host + ':' + (serverConfig.port || '8020') + '/fisreceiver.php',
                // exclude: /\/page\/demo\//,
                to: _deploy.to,
                useHash: true
            })
        });
    }
});