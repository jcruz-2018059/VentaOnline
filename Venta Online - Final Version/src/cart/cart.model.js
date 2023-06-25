'use strict'

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

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
    
    totalPrice:{
        type: Number,
    }
},{
    versionKey: false
})

module.exports = mongoose.model('Cart', productSchema);