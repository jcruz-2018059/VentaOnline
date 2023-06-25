'use strict'

const billController = require('./bills.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated');

//Rutas privadas
api.post('/addBill', ensureAuth, billController.addBill);
//Rutas de administradors
api.put('/updateBill/:id', [ensureAuth, isAdmin], billController.updateBill);
api.get('/getBillsByUser/:id', [ensureAuth, isAdmin], billController.getBills);
api.get('/getProductsByBills/:id', [ensureAuth, isAdmin], billController.getProductsByBills);

module.exports = api;
