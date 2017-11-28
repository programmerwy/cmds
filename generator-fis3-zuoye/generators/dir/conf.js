const DATE = new Date();

function dateFormater(dateObj) {
    var month = dateObj.getMonth() + 1,
        month = month >= 10 ? month : '0' + month,
        date = dateObj.getDate(),
        date = date >= 10 ? date : '0' + date;
    return dateObj.getFullYear() + '-' + month + '-' + date;
    // ES7
    // return dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1).padStart(2, 0) + '-' + dateObj.getDate().padStart(2, 0);
}

module.exports = {
    comment: [
        '<!--\n * Copyright (c) 2014-' + DATE.getFullYear() + ' ${corp}, All rights reseved.\n * @fileoverview ${fileoverview}\n * @author ${author} | ${email}\n * @version 1.0 | ' + dateFormater(DATE) + ' | ${author}   // 初始版本。\n -->',
        '/**\n * Copyright (c) 2014-' + DATE.getFullYear() + ' ${corp}, All rights reseved.\n * @fileoverview ${fileoverview}\n * @author ${author} | ${email}\n * @version 1.0 | ' + dateFormater(DATE) + ' | ${author}    // 初始版本。\n */'
    ],
    path: {
        tpl: 'page',
        static: 'static',
        test: 'test/page'
    }
}