'use strict';

const mongoose = require('mongoose');
const product = mongoose.model('product');

const getProducts = async (req, res, next) => {
    try {
        const onlyAvailable = req.query.available === 'true';
        let query = {};
        if (onlyAvailable) {
            // if onlyAvailable then only return products with inventory_count > 0
            query.inventory_count = {
                $gt: 0
            };
        }
        const foundProducts = await product.find(query);
        res.status(200).json(foundProducts);
    } catch (err) {
        next(err);
    }
};

const singlePurchase = async (req, res, next) => {
    try {
        const foundProduct = await product.findOne({
            title: req.params.productTitle,
        });
        if (!foundProduct) {
            res.status(404).json({ message: 'Product does not exist' });
        } else if (foundProduct.inventory_count == 0) {
            res.status(400).json({ message: 'Product has no available inventory' });
        } else {
            await product.updateOne({ title: req.params.productTitle, },
                {
                    $set: {
                        inventory_count: --foundProduct.inventory_count,
                    }
                });
            res.status(204).send();
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getProducts,
    singlePurchase,
}
