const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const invoiceSchema = mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' },
  username:{
    type: String },
  email:{
    type: String },
  cart: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cart' },
  products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: {
          type: Number,
        },
        price:{
          type: Number,
        }
      }
    ],
  totalPrice: { 
    type: Number, 
    required: true },
  date: { 
    type: Date, 
    default: Date.now() }
    
},{versionKey: false});

module.exports = mongoose.model('Bill', invoiceSchema);