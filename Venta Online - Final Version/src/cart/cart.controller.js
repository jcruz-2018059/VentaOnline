'use strict'

const Cart = require('./cart.model');
const User = require('../user/user.model');
const Product = require('../product/product.model');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//Función test 
exports.test = async(req, res)=>{
    res.send({message: 'test cart running'});
};

//Función agregar al carrito
exports.addToCart = async (req, res) => {
  try{
    let userId = req.user.sub;
    let { products, quantity } = req.body;
    let existProduct = await Product.findOne({_id: products});
    let existCart = await Cart.findOne({userId: userId});

    if(!existProduct) return res.send({message: 'Product not found'});

    if(existCart){
      const productIndex = existCart.products.findIndex(item => item.product == products);
      if (productIndex > -1) {
        existCart.products[productIndex].quantity +=1;
        existCart.totalPrice += existProduct.price;
      } else {
        existCart.products.push({ product: products, quantity:quantity, price: existProduct.price});
        existCart.totalPrice += existProduct.price*quantity;
      }

      await existCart.save();
      return res.send({message: 'Producto agregado al carrito'})
    }else{
      let price = existProduct.price;
      let total = price * quantity;

      let newCart = new Cart({
        userId: userId,
        products: [{
          product: existProduct._id,
          quantity: quantity,
          price: price
        }],
        totalPrice: total
      });

      await newCart.save();
      return res.send({message: 'Carrito creado'})
    }
  }catch(err){
    console.error(err);
    return res.status(500).send({message: 'Error server, no se pudo agregar al carrito'})
  }
};

//Función editar carrito de compras
exports.updateCart = async(req, res) =>{
  try{
    let userId = req.user.sub;
    let { products, quantity } = req.body;
    let existCart = await Cart.findOne({userId: userId});
    let existProduct = await Product.findOne({_id: products});

    if(!existCart) return res.send({message: 'Shopping cart not found'});
    let productIndex = existCart.products.findIndex(item => item.product == products);
    if (productIndex === -1) {
      res.status(404).json({ message: 'Producto no encontrado en el carrito' });
      return;
    }

    let cant = existCart.products[productIndex].quantity
    existCart.totalPrice -= (cant*existProduct.price);
    existCart.products[productIndex].quantity = quantity;
    let cant2 = existCart.products[productIndex].quantity;
    existCart.totalPrice += (cant2*existProduct.price);
    await existCart.save();

    res.json({ message: 'Producto actualizado en el carrito' });
  }catch(err){
    console.error(err);
    return res.send({message: 'Error server, error updating cart'});
  }
};

//Función eliminar productos del carrito
exports.removeProduct = async(req, res) =>{
  try{
    let userId = req.user.sub;
    let { products } = req.body;
    let cart = await Cart.findOne({ userId: userId });
    let existProduct = await Product.findOne({_id: products})

    if (cart) {
      let productIndex = cart.products.findIndex(item => item.product == products);

      if (productIndex > -1) {
        let product = cart.products[productIndex];
        let productPrice = product.quantity * existProduct.price;
      
        cart.products.splice(productIndex, 1);
        cart.totalPrice -= productPrice;
        await cart.save();

        return res.send({ message: 'Product deleted succesfully' });
      } else {
        return res.send({ message: 'Product doesnt exist in the shopping cart' });
      }
    } else {
      return res.send({ message: 'Shopping cart not found'});
    }
  }catch(err){
    console.log(err);
    return res.status(500).send({message: 'Error server, error removing product from shopping cart'})
  }
};

//Función eliminar carrito de compras
exports.deleteCart = async (req, res) =>{
  try{
    let userId = req.user.sub;
    let cartId = req.params.id;
    let existCart = await Cart.findOne({_id:cartId});

    if(!existCart) return res.send({message: 'Cart not found'});

    if(existCart.userId != userId) return res.send({message: 'Dont have permission to do this action'})
    let deleteCart = await Cart.findByIdAndDelete({_id: cartId});

    if(!deleteCart) return res.send({message: 'Cart not found and not deleted'})
        return res.send({message: 'Cart deleted succesfully', deleteCart});
  }catch(err){
    console.error(err);
    return res.status(500).send({message: 'Error removing shopping cart'});
  }
};

