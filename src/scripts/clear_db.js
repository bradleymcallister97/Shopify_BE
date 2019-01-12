'use strict';

// Setup db
require('../setup_db.js');
const mongoose = require('mongoose');

const product = mongoose.model('product');

const run = async () => {
    try {
        await product.deleteMany();
        console.log('Done!');
        process.exit(0);
    } catch(err) {
        console.err('Uho, err: ', err);
        process.exit(-1);
    };
}

run();
