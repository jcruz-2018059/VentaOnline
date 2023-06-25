'use strict'
const Bill = require('../bills/bills.model');
const User = require('./user.model')
//Desestructuración
const { validateData, encrypt, checkPassword, isAdmin } = require('../utils/validate');
const { createToken } = require('../services/jwt');
const e = require('express');

exports.test = (req, res)=>{
    res.send({message: 'Test function is running', user: req.user});
}


//Función registrarse
exports.register = async(req, res)=>{
    try{
        let data = req.body;
        data.password = await encrypt(data.password);
        data.role = 'client';
        let user = new User(data);
        await user.save();
        return res.send({message: 'Registered Successfully'})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating account', Error: err.message});
    }
}

//Función login
exports.login = async(req, res)=>{
    try{
        //obtener la data a validar (username y password)
        let data = req.body;
        let userExist = await User.findOne({username: data.username});
        let misCompras= await Bill.find({user: userExist._id});
        let credentials = {
            username: data.username,
            password: data.password
        }
        let msg = validateData(credentials);
        if(msg) return res.status(400).send({message: msg})
        //Validar que exista el usuario en la BD
        let user = await User.findOne({username: data.username});
        //Validar que la contraseña coincida
        if(user && await checkPassword(data.password, user.password)) {
            let token = await createToken(user)
            return res.send({message: 'User logged successfully', token, misCompras});
        }
        return res.status(404).send({message: 'Invalid credentials'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not logged'});
    }
}

//Función Agregar Usuarios
exports.save = async(req, res)=>{
    try{
        //Capturar la data
        let data = req.body;
        let params = {
            password: data.password
        }
        let validate = validateData(params);
        if(validate) return res.status(400).send(validate)
        //encriptar la password
        data.password = await encrypt(data.password);
        //Guardar la info
        let user = new User(data);
        await user.save();
        return res.send({message: 'Accound created sucessfully'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error saving user', error: err.message});
    }
}

//Funcion Actualizar
exports.update = async(req, res)=>{
    try{
        //Obtener el Id del usuario a actualizar
        let userId = req.params.id;
        //Obtener los datos a actualizar
        let data = req.body;
        //Validar si tiene permisos
        if(req.user.role == 'ADMIN'){
            let user = await User.findOne({_id: userId});
            //Validar el role
            if(!data.password && user.role == 'CLIENT'){
                //validar si existe el usuario
                let existUser = await User.findOne({name: data.name});
                if(existUser) {
                    if(existUser._id != userId) return res.send({message: 'User already created'});
                    let updatedUser = await User.findOneAndUpdate( //Validar que exista el Usuario
                        {_id: userId},
                        data,
                        {new: true}
                    );
                    if(!updatedUser) return res.status(404).send({message: 'User not found and not updated'});
                    return res.send({updatedUser})
                }
                let updatedUser = await User.findOneAndUpdate( //Validar que exista la Usuario
                    {_id: userId},
                    data,
                    {new: true}
                );
                if(!updatedUser) return res.status(404).send({message: 'User not found and not updated'});
                return res.send({updatedUser})
            }else{
                return res.status(401).send({message: 'Dont have permission to do this action'});
            }
            //res.send({message: 'Es admin'})
        }else{
        if(userId != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this action'});
        //Validar que le llegue data a actualizar
        if(data.password || Object.entries(data).length === 0 || data.role) return res.status(400).send({message: 'Have submitted some data that cannot be updated'});
        let userUpdated = await User.findOneAndUpdate(
            {_id: req.user.sub},
            data,
            {new: true} 
        )
        if(!userUpdated) return res.status(404).send({message: 'User not found adn not updated'});
        return res.send({message: 'User updated', userUpdated})}
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not updated', err: `Username ${err.keyValue.username} is already taken`});
    }
}

//Funcion Eliminar 
exports.delete = async(req, res)=>{
    try{
        //Obtener el id a eliminar
        let userId = req.params.id;
        //Validar si tiene permisos
        if(req.user.role == 'ADMIN'){
            let user = await User.findOne({_id: userId});
            if(user.role != 'CLIENT') return res.send({message: 'You dont have permission to do this action'})
            let userDeleted = await User.findOneAndDelete({_id: userId});
            if(!userDeleted) return res.send({message: 'Account not found and not deleted'});
            return res.send({message: `Account with username ${userDeleted.username} deleted sucessfully`});
        }else{
        if( userId != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this action'});
        //Eliminar
        let userDeleted = await User.findOneAndDelete({_id: req.user.sub});
        if(!userDeleted) return res.send({message: 'Account not found and not deleted'});
        return res.send({message: `Account with username ${userDeleted.username} deleted sucessfully`});
        }
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not deleted'});
    }
}

//Función usuario default
exports.defaultUser = async()=>{
    try{
        let defUser= {
            name: 'Javier',
            surname: 'Cruz',
            username: 'jcruz',
            password: '123',
            email: 'jcruz@gmail.com',
            phone: '4893 - 4570',
            role: 'Admin'
        }
        let existUser = await User.findOne({name: 'Javier'}); 
        if(existUser) return console.log('Default user already created');
        defUser.password = await encrypt(defUser.password);
        let createdDefault = new User(defUser);
        await createdDefault.save();
        return console.log('Default User created');
    }catch(err){
        return console.error(err);
    }
}