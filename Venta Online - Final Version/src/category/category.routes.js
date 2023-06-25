'use strict'


const express = require('express'); //importar express
const api = express.Router(); //Utilizar el enrutador de express
const categoryController = require('./category.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.get('/', categoryController.test);
//Rutas privadas
api.get('/get', ensureAuth, categoryController.getCategories)
//Rutas de administrador
api.post('/add',[ensureAuth, isAdmin ], categoryController.addCategory);
api.put('/update/:id',[ensureAuth, isAdmin ], categoryController.updateCategory);
api.delete('/delete/:id',[ensureAuth, isAdmin ], categoryController.deleteCategory);

module.exports = api;