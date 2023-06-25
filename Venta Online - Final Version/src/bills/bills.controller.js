'use strict'

const Bill = require('./bills.model');
const Cart = require('../cart/cart.model');
const User = require('../user/user.model');
const Product = require('../product/product.model');
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;


//Función agregar factura
exports.addBill = async(req, res) =>{
    try{
        let { cartId } = req.body;
        let cart = await Cart.findById(cartId);
        let existUser = await User.findOne(cart.userId);
        if (!cart) {
        return res.status(404).json({ message: 'Carrito de compras no encontrado' });
        }

        let user = await User.findById(cart.userId);
        if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        for (let item of cart.products) {
        let product = await Product.findById(item.product);
        if (!product) {
            return res.status(404).json({ message: `Producto ${item.product} no encontrado` });
        }

        product.stock -= item.quantity;
        product.sales += item.quantity;
        await product.save();
        }

        let Factura = new Bill({
        user: user._id,
        cart: cart._id,
        username: existUser.username,
        email: existUser.email,
        products: cart.products,
        totalPrice: cart.totalPrice
        });
        await Factura.save();

        res.json({ Factura });
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error server, error adding bill'})
    }
};

//Función actualizar factura
exports.updateBill = async(req, res)=>{
    try{
        let billId = req.params.id;
        let { products, quantity } = req.body;
        let idProduct =  mongoose.Types.ObjectId(products);
        let existBill = await Bill.findById(billId);
        let existProduct = await Product.findOne({_id: idProduct});
        //return res.send(existBill.products);
        if(!existBill) return res.send({message: 'Bill not found'});
        let productIndex = existBill.products.findIndex((item) => item.product == products);
        //return res.send({message: productIndex});
        if (productIndex === -1) {
            res.status(404).json({ message: 'Product not found in the bill' });
            return;
          }

          if (quantity> existBill.products[productIndex].quantity) {
            let cant = quantity - existBill.products[productIndex].quantity;
            existProduct.stock += cant;
            existProduct.sales -= cant;
          } else {
            let cant = existBill.products[productIndex].quantity - quantity;
            existProduct.stock += cant;
            existProduct.sales -= cant;
          }
          await existProduct.save();
        

          let cant = existBill.products[productIndex].quantity
          existBill.totalPrice -= (cant*existProduct.price);
          existBill.products[productIndex].quantity = quantity;
          let cant2 = existBill.products[productIndex].quantity;
          existBill.totalPrice += (cant2*existProduct.price);
          await existBill.save();

          return res.send({message: 'Bill updated succesfully'});
    }catch(err){
        console.error(err);
        return res.status({message: 'Error server, error updating bill'})
    }
}

//Función buscar facturas por usuario
exports.getBills = async(req, res)=>{
    try{
        let userId = req.params.id;
        let existUser = await User.findOne({_id:userId});
        let billsByUser = await Bill.find({user: userId});
        if(!billsByUser) return res.send({message: 'Bills not found'})
        return res.send({message: 'Bills:', billsByUser});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error server, Bills not found'})
    }
}

//Función ver productos de una factura
exports.getProductsByBills = async(req, res)=>{
    try{
        let billId = req.params.id;
        let existBill = await Bill.findOne({_id:billId}).populate('products');
        if(!existBill) return res.send({message: 'Bill not found'});
        return res.send({message: 'Bill:', existBill});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error server, Products not found'})
    }
}
