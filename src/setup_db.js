'use strict';

const config = require('../config');
const mongoose = require('mongoose');

// Connect to mongodb
const mongooseConStr = config.MONGO_CON_STR;
mongoose.connect(mongooseConStr, { useNewUrlParser: true });

// models
require('../models');
