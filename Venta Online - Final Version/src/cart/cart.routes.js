'use strict'

const cartController = require('./cart.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated');


//Rutas publicas
api.get('/',cartController.test);
//Rutas privadas
api.post('/addCart', ensureAuth, cartController.addToCart);
api.put('/updateCart', ensureAuth, cartController.updateCart);
api.delete('/deleteCart/:id', ensureAuth, cartController.deleteCart);
api.delete('/deleteProduct', ensureAuth, cartController.removeProduct);



module.exports = api;