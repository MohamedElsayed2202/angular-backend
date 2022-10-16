const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errorThrewer = require('../helpers/error');
class Auth {
    static getUsers = async (req, res, next) => {
        try {
            const users = await User.find();
            if(!users){
                errorThrewer(401,'No users found.');
            }
            res.status(200).send(users)
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }
    static register = async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
            errorThrewer(422, 'Validation faild.');
            }
            if(!req.file){
                errorThrewer(422, 'Image not provided');
            }
            const image = req.file.path.replace("\\", "/");
            req.body['image'] = image;
            const encPassword = await bcrypt.hash(req.body.password, 12);
            req.body.password = encPassword;
            const user = new User(req.body);
            await user.save();
            res.status(201).send(user);
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }

    static updateUser = async(req, res, next)=>{
        try {
            const id = req.params['id'];
            if(req.file){
                req.body.imageUrl = req.file.path.replace("\\", "/");
            }
            if(!req.body.imageUrl){
                errorThrewer(422, 'No image picked')
            }
            const user = await User.findById(id);
            if(!user){
                errorThrewer(404,'Could not get the user');
            }
            if(req.body.imageUrl !== user.image){
                Auth.clearImage(user.image);
            }
            const isEqual = await bcrypt.compare(req.body.password, user.password);
            if(!isEqual){
                const encPassword = await bcrypt.hash(req.body.password,12)
                req.body.password = encPassword;
            }
            user.name = req.body.name;
            user.image = req.body.imageUrl;
            user.email = req.body.email;
            user.password = req.body.password;
            user.type = req.body.type
            await user.save();
            res.status(200).send(user);
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }

    static deleteUser = async(req, res, next)=>{
        try {
            const id = req.params['id'];
            const user = await User.findById(id);
            if(!user){
                errorThrewer(422,'No user founded!.');
            }
            if(user.image){
                Auth.clearImage(user.image);
            }
            await User.findByIdAndDelete(id);
            res.status(200).send({'message':'Deleted!'});
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }

    static checkEmail = async (req, res, next) => {
        try {
            const id = req.query['id'];
            const email = req.query['email'];
            if(id){
                const user = await User.findById(id);
                if(!user){
                    errorThrewer(401, 'User not found')
                }
                return res.status(200).send(user);
            }
            else if (email) {
                const user = await User.findOne({email: email});
                if(!user){
                    return res.status(200).send(false);
                }
                return res.status(200).send(true);
            }
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }

    static logIn = async(req, res, next)=>{
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await User.findOne({email: email});
            if(!user){
                errorThrewer(401,'A user with this email could not be found.');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if(!isEqual){
                errorThrewer(401,'Wrong password.');
            }
            const token = jwt.sign({
                id: user._id.toString(),
                email: user.email
            },
            process.env.JWTSECRET,
            {expiresIn: '12h'} 
            );
            return res.status(200).send({user: user, token: token});
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }

    static getById = async(req, res, next)=>{
        try {
            const id = req.params['id'];
            const user = await User.findById(id);
            if(!user){
                errorThrewer(422,'User not found!');
            }
            res.status(200).send(user);
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }
    
    static clearImage(filePath){
        filePath = path.join(__dirname,'..', filePath);
        fs.unlink(filePath, err => console.log(err));
    }
}

module.exports = Auth;