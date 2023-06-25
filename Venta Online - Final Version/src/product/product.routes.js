'use strict'

const productController = require('./product.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated');

//Rutas publicas
api.get('/', productController.test);
//Rutas privadas
api.get('/getBestSelled', ensureAuth, productController.getBestSellers);
api.get('/getCatalogue/:id', ensureAuth, productController.getCatalogue);
api.get('/getByName/:name', ensureAuth, productController.searchByName);
//Rutas de administrador 
api.post('/add',[ensureAuth, isAdmin], productController.add);
api.get('/get/:id', [ensureAuth, isAdmin], productController.get);
api.get('/get', [ensureAuth, isAdmin], productController.getProducts);
api.get('/getSoldOut', [ensureAuth, isAdmin], productController.getSoldOut);
api.put('/update/:id', [ensureAuth, isAdmin], productController.update);
api.delete('/delete/:id', [ensureAuth, isAdmin], productController.delete);



module.exports = api;