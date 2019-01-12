'use strict'

const mongoose = require('mongoose');
const user = mongoose.model('user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../config');

const register = async (req, res, next) => {
    try {
        const foundUser = await user.findOne({
            username: req.body.username
        });
        if (!foundUser) {
            var newUser = new user(req.body);
            newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
            await newUser.save();
            res.status(201).send();
        } else {
            res.status(409).send({
                message: 'Username already in use'
            });
        }
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const foundUser = await user.findOne({
            username: req.body.username
        });
        if (!foundUser) {
            res.status(401).json({
                message: 'Authentication failed. User not found.'
            });
        } else {
            if (!foundUser.comparePassword(req.body.password)) {
                res.status(401).json({ message: 'Authentication failed.' });
            } else {
                res.status(200).json({
                    token: jwt.sign({
                        username: foundUser.username,
                        _id: foundUser._id,
                    }, config.PUBKEY, { expiresIn: '1day' })
                });
            }
        }
    } catch (err) {
        next(err);
    }
};

const verify = (req, res) => {
    if (req.user) {
        res.status(200).json({ msg: 'success' });
    } else {
        res.status(401).json({
            message: 'Unauthorized user!'
        });
    }
};

module.exports = {
    register,
    login,
    verify,
};
