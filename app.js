'use strict';

const config = require('./config');
require('./src/setup_db.js');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// handlers
const auth = require('./src/handlers/auth.js');
const product = require('./src/handlers/product.js');
const shoppingCart = require('./src/handlers/cart.js');

// constants
const PORT = config.PORT;
const PUBKEY = config.PUBKEY;

// Init app
const app = express();
app.use(bodyParser.json());

// Log request
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

// Get Products
app.get('/products', product.getProducts);

// Create a new user
app.post('/register', auth.register);

// Login with existing user
app.post('/login', auth.login);

// Auth check
app.use(async (req, res, next) => {
    var auth = _.get(req, 'headers.authorization', null);
    if (auth === null) {
        res.status(401).send({ message: 'Unauthorized' });
    } else {
        try {
            const decode = await jwt.verify(auth.split(' ')[1], PUBKEY);
            // add decoded user object to request
            req.user = decode;
            next();
        } catch (err) {
            res.status(401).send({ message: 'Unauthorized' });
        }
    }
});

// Verify JWT token is valid
app.get('/verify', auth.verify);

// Purchase a single product
app.post('/purchase/:productTitle', product.singlePurchase);

// Checkout with users cart
app.post('/cart/checkout', shoppingCart.checkout);

// Add product with quantity to users cart
app.post('/cart/:productTitle', shoppingCart.addProduct);

// Remove quantity of product from users cart
app.delete('/cart/:productTitle', shoppingCart.removeProductFromCart);

// Clear users cart
app.delete('/cart', shoppingCart.clearCart);

// Get users cart
app.get('/cart', shoppingCart.getCart);

// General Error Catch
app.use((err, req, res, next) => {
    console.error('Error in API', err);
    res.status(500).send({ message: 'Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
