'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var cartSchema = new Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    products: {
        type: Schema.Types.Mixed,
        required: true
    },
});

mongoose.model('cart', cartSchema);
