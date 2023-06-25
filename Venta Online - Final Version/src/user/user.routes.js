'use strict'

const userController = require('./user.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated');

//Rutas públicas
api.get('/', userController.test);
api.post('/register', userController.register);
api.post('/login', userController.login);
//Rutas privadas
api.put('/update/:id', ensureAuth, userController.update);
api.delete('/delete/:id', ensureAuth, userController.delete);
//Rutas de administrador
api.post('/save',[ensureAuth, isAdmin ], userController.save )

module.exports = api;


