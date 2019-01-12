'use strict';

// Setup db
require('../setup_db.js');
const mongoose = require('mongoose');

const product = mongoose.model('product');

const seed = [
    {
        title: 'Chair',
        price: 55,
        inventory_count: 12,
    },
    {
        title: 'Macbook',
        price: 100000,
        inventory_count: 1,
    },
    {
        title: 'Beer',
        price: 10,
        inventory_count: 0,
    },
    {
        title: 'Headphones',
        price: 100,
        inventory_count: 3,
    }
]

const run = async () => {
    try {
        await product.create(seed);
        console.log('Done!');
        process.exit(0);
    } catch(err) {
        console.err('Uho, err: ', err);
        process.exit(-1);
    };
}

run();
