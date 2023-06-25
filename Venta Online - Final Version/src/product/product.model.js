'use strict'



const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type: String,
        required:true,
        unique: true
    },

    price:{
        type: Number,
        required: true,
    },

    stock:{
        type: Number,
        required: true,
    },
    sales:{
        type: Number,
        required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categori',
        required: true
    }
},{
    versionKey: false
})

module.exports = mongoose.model('Product', productSchema);