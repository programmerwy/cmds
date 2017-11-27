#!/usr/bin/env node
'use strick';

import fs from 'fs';
import { parse, transform } from 'csv';
import Controller from './controller';

var output = [];
var parser = parse({ delimiter: '  ' });
var input = fs.createReadStream('./hijack.csv');
var [counter, limit] = [0, Infinity];
var [succ, err] = [0, 0];

var transformer = transform((record, callback) => {
    if (counter++ >= limit) return;

    var controller = new Controller({ record: record });
    controller.injectJs().then(res => {
        var extInfo = null;
        if (res.errStr == 'succ') {
            extInfo = res.namespace;
            succ++;
        } else {
            extInfo = res.path;
            err++;
        }
        console.log('Stat: %s, ExtInfo: %s, ', res.errStr, extInfo);
    });

}, { parallel: 100 });

transformer.on('finish', _ => {
    console.log('==========  Counter: %s, Succ: %s, Err: %s', counter, succ, err);
});

input.pipe(parser).pipe(transformer).pipe(process.stdout);