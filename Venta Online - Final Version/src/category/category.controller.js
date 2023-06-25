'use strict'

const Category = require('./category.model');
const Product = require('../product/product.model');
const e = require('express');

exports.test = (req, res)=>{
    res.send({message: 'test category running'})
}

//Función Categoria default
exports.defaultCategory = async()=>{
    try{
        let defCategory = {
            name: 'Default',
            description: 'Category default'
        }
        let existCategory = await Category.findOne({name: 'Default'});
        if(existCategory) return console.log('Default category already created');
        let createdDefault = new Category(defCategory);
        await createdDefault.save();
        return console.log('Default category created');
    }catch(err){
        return console.error(err);
    }
}

//Funcion agregar
exports.addCategory = async(req, res)=>{
    try{
        let data = req.body;
        let existCategory = await Category.findOne({name: data.name})
        if(existCategory){
            return res.send({message: 'Category already created'})
        }
        let newCategory = new Category(data);
        await newCategory.save();
        return res.status(201).send({message: 'Created Category'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating category', Error: err.message});
    }
}

//Funcion buscar
exports.getCategories = async(req, res)=>{
    try{
        let categories = await Category.find();
        return res.send({categories});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting categories'})
    }
}


//Funcion editar
exports.updateCategory = async(req, res)=>{
    try{
        let categoryId = req.params.id;
        let data = req.body;
        let existCategory = await Category.findOne({name: data.name});
        if(existCategory) {
            if(existCategory._id != categoryId) return res.send({message: 'Category already created'});
            let updatedCategory = await Category.findOneAndUpdate( //Validar que exista la categoría
                {_id: categoryId},
                data,
                {new: true}
            );
            if(!updatedCategory) return res.status(404).send({message: 'Category not found and not updated'});
            return res.send({updatedCategory})
        }
        let updatedCategory = await Category.findOneAndUpdate( //Validar que exista la categoría
            {_id: categoryId},
            data,
            {new: true}
        );
        if(!updatedCategory) return res.status(404).send({message: 'Category not found and not updated'});
        return res.send({updatedCategory})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating category'});
    }
}

//Función Eliminar

exports.deleteCategory = async(req, res)=>{
    try{
        let categoryId = req.params.id; 
        let defaultCategory = await Category.findOne({name: 'Default'});
        if(defaultCategory._id == categoryId) return res.send({message: 'Category cannot delete'});
        await Product.updateMany(
            {category: categoryId},
            {category: defaultCategory._id}
        );
        let deletedCategory = await Category.findOneAndDelete({_id: categoryId});
        if(!deletedCategory) return res.status(404).send({message: 'Category not found and not deleted'});
        return res.send({message: 'Category deleted sucessfully', deletedCategory})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error removing category'})
    }
}