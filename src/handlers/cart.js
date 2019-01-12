'use strict';

const mongoose = require('mongoose');
const cart = mongoose.model('cart');
const product = mongoose.model('product');
const _ = require('lodash');

const addProduct = async (req, res, next) => {
    const productTitle = req.params.productTitle;
    const productQuantity = req.body.quantity;
    const addedProducts = {
        [productTitle]: productQuantity,
    }
    try {
        const foundProduct = await product.findOne({
            title: productTitle,
        });
        if (!foundProduct) {
            res.status(404).json({ message: 'Product does not exist' });
        } else {
            const foundCart = await cart.findOne({
                username: req.user.username,
            });
            if (!foundCart) {
                if (foundProduct.inventory_count < productQuantity) {
                    res.status(400).json({ message: 'There is not enough product available in inventory' });
                } else {
                    await cart.create({
                        username: req.user.username,
                        products: addedProducts,
                    });
                    res.status(204).send();
                }
            } else {
                const updatedProducts = foundCart.products;
                if (!updatedProducts[productTitle]) {
                    updatedProducts[productTitle] = productQuantity;
                } else {
                    updatedProducts[productTitle] += productQuantity;
                }

                if (foundProduct.inventory_count < updatedProducts[productTitle]) {
                    res.status(400).json({ message: 'There is not enough product available in inventory' });
                } else {
                    await cart.updateOne({
                        username: req.user.username,
                    }, {
                            $set: {
                                products: updatedProducts,
                            }
                        });
                    res.status(204).send();
                }
            }
        }
    } catch (err) {
        next(err);
    }
};

const removeProductFromCart = async (req, res, next) => {
    try {
        const productTitle = req.params.productTitle;
        const productQuantity = req.body.quantity;
        const usersCart = await cart.findOne({
            username: req.user.username,
        });
        if (usersCart) {
            // Update quantity of product
            const newProductCart = usersCart.products;
            newProductCart[productTitle] = newProductCart[productTitle] - productQuantity;
            // if new quantity is not a number or 0 or less then remove from cart
            if (_.isNaN(newProductCart[productTitle]) || newProductCart[productTitle] <= 0) {
                delete newProductCart[productTitle];
            }
            await cart.updateOne({
                username: req.user.username,
            }, {
                    $set: {
                        products: newProductCart,
                    }
                });
        }
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

const clearCart = async (req, res, next) => {
    try {
        await cart.deleteOne({
            username: req.user.username,
        });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

const checkout = async (req, res, next) => {
    try {
        const usersCart = await cart.findOne({
            username: req.user.username,
        });
        if (!usersCart) {
            res.status(404).json({ message: 'User does not have a open cart' })
        } else {
            const productsToPurchase = _.keys(usersCart.products);
            // The in is broken
            const foundProducts = await product.find({
                title: {
                    $in: productsToPurchase
                }
            });
            // Make sure all products still have enough inventory
            let unavailableProducts = [];
            foundProducts.forEach((foundProduct) => {
                if (foundProduct.inventory_count < usersCart.products[foundProduct.title]) {
                    unavailableProducts.push(foundProduct.title);
                }
            });
            // Check to make sure all products are still in inventory
            if (unavailableProducts.length > 0) {
                res.status(400).json({
                    message: `Products [${unavailableProducts.join(', ')}] does not have enough inventory`,
                    unavailableProducts: unavailableProducts,
                });
            } else {
                // Update all product inventory count
                const updatePromises = [];
                foundProducts.forEach((foundProduct) => {
                    updatePromises.push(
                        product.updateOne({ title: foundProduct.title, },
                        {
                            $set: {
                                inventory_count: foundProduct.inventory_count - usersCart.products[foundProduct.title],
                            }
                        })
                    );
                });
                await Promise.all(updatePromises);
                // Delete users cart
                await cart.deleteOne({
                    username: req.user.username,
                });
                res.status(200).send();
            }
        }
    } catch (err) {
        next(err);
    }
}

const getCart = async (req, res, next) => {
    try {
        const usersCart = await cart.findOne({
            username: req.user.username,
        });
        // If user does not have a cart return empty object
        let products = {};
        if (usersCart) {
            products = usersCart.products;
        }
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addProduct,
    checkout,
    clearCart,
    getCart,
    removeProductFromCart,
}
