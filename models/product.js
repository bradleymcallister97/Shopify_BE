'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var product = new Schema({
    title: { 
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true
    },
    inventory_count: {
        type: Number,
        required: true
    },
});

mongoose.model('product', product);
