'use strict'

require('dotenv').config();
const mongoConfig = require('./configs/mongo');
const app = require('./configs/app');
const userController = require('./src/user/user.controller');
const categoryController = require('./src/category/category.controller');

mongoConfig.connect();
app.initServer();

userController.defaultUser();
categoryController.defaultCategory();