'use strict'

const Product = require('./product.model')
const Categori = require('../category/category.model');

//Función test
exports.test = async(req, res)=>{
    res.send({message: 'test product running'})
}

//Función agregar producto
exports.add = async (req, res)=>{
    try{
        let data = req.body;
        let category = await Categori.findOne({_id: data.category});
        if(!category) return res.status(404).send({message: 'Category not found'});
        let product =  new Product(data);
        await product.save();
        return res.send({message: 'Product created succesfully'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating product'});
    }
}

//Función listar producto
exports.get = async(req, res)=>{
    try{
        let productId = req.params.id;
        let existProduct = await Product.findOne({_id: productId}).populate('category');
        if(!existProduct) res.status(404).send({message: 'Product not found'});
        return res.send({existProduct});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting product'})
    }
}

//Función listar productos
exports.getProducts = async(req, res)=>{
    try{
        let products = await Product.find().populate('category');
        if(!products) return res.status(404).send({message: 'Erro, products not found'})
        return res.send({products});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Erro getting Products'})
    }
}

//Funcion ver productos por categoria
exports.getCatalogue = async(req, res)=>{
    try{
        let categoryId = req.params.id;
        let categoryExist = await Categori.findOne({_id: categoryId});
        if(!categoryExist) return res.send({message: 'Category not found'});
        let categoryProducts = await Product.find({category: categoryId}).populate('category');
        if(!categoryProducts) return res.status(404).send({message: 'Products not found'});
        return res.send({'Category products' : categoryExist.name , categoryProducts});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error server, products not found'})
    }
}

//Función buscar por nombre
exports.searchByName = async(req, res)=>{
    try{
        let productName = req.params.name;
        let existProduct = await Product.findOne({name: productName});
        if(!existProduct) return res.send({message: 'Product not found'})
        return res.send({existProduct});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error server, product not found'})
    }
}

//Función de Actualizar producto
exports.update = async(req, res)=>{
    try{
        let productId = req.params.id;
        let data = req.body;
        let existProduct = await Product.findOne({_id: productId});
        if(!existProduct) return res.status(401)({message: 'Product not found'});
        let updateProduct = await Product.findOneAndUpdate(
            {_id: productId},
            data,
            {new: true}
        ).populate('category')
        if(!updateProduct) return res.send({message: 'Product not found and not updating'})
        return res.send({message: 'Product updated:', updateProduct});  
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating product'})
    }
}

//Funcion Eliminar producto
exports.delete = async(req, res)=>{
    try{
        let productId = req.params.id;
        let deleteProduct = await Product.findOneAndDelete({_id: productId});
        if(!deleteProduct) return res.send({message: 'Product not found and not deleted'})
        return res.send({message: 'Product deleted succesfully', deleteProduct});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error removing product'})
    }
}

//Función buscar productos agotados
exports.getSoldOut = async(req, res)=>{
    try{
        let soldOut = await Product.find({stock: '0'}).populate('category');
        if(!soldOut) return res.send({message: 'Products not found'})
        return res.send({message: 'Out of stock products:', soldOut});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error server, products not found'})
    }
}

//Función buscar productos más vendidos
exports.getBestSellers = async(req, res)=>{
    try{
        let bestSellers = await Product.find({}).sort({sales: -1});
        if(!bestSellers) return res.send({message: 'Products not found'});
        return res.send({message: 'Most selled products', bestSellers});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error server, products not found'})
    }
}