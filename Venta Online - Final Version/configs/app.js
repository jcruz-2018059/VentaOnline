'use strict'

const express = require('express');
//Logs de las solicitudes que reciba el servidor
const morgan = require('morgan');
//Seguridad básica al servidor
const helmet = require('helmet');
//Aceptación de solicitudes desde otro origen o desde la misma máquina
const cors = require('cors');
//Instancia de express
const app = express();
const port = process.env.PORT || 3200;
const userRoutes = require('../src/user/user.routes');
const categoryRoutes = require('../src/category/category.routes');
const productRoutes = require('../src/product/product.routes');
const cartRoutes = require('../src/cart/cart.routes');
const billRoutes = require('../src/bills/bills.routes');

//Configurar el servidor de express
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

//Rutas de cada colección
app.use('/category', categoryRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);
app.use('/bill', billRoutes);


//Función para levanter el puerto
exports.initServer = ()=>{
    app.listen(port);
    console.log(`Server http running in port ${port}`);
}