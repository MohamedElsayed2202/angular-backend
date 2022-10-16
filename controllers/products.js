const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/product');
const errorThrewer = require('../helpers/error');

class Products{
    static addProduct = async(req, res, next)=>{
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty){
                errorThrewer(422, 'Validation faild.');
            }
            if(!req.file){
                errorThrewer(422, 'Image not provided');
            }
            const image = req.file.path.replace("\\", "/");
            req.body['image'] = image;
            const product = new Product(req.body)
            await product.save();
            res.status(201).send(product);
        } catch (error) {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        }
    }
    static getProducts = async(req, res, next)=>{
        try {
            const products = await Product.find();
            if(!products){
                errorThrewer(401,'No products added for this category');
            }
            res.status(200).send(products);
        } catch (error) {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        }
    }

    static filterProducts = async(req, res, next)=>{
        try {
            const name = req.query['name'];
            const prods = await Product.find({name: {$regex:new RegExp(name)}});
            res.status(200).send(prods);
        } catch (error) {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        }
    }

    static updateProduct = async(req,res, next)=>{
        try {
            const id = req.params['id'];
            if(req.file){
                req.body.imageUrl = req.file.path.replace("\\", "/");
            }
            if(!req.body.imageUrl){
                errorThrewer(422, 'No image picked')
            }
            const product = await Product.findById(id);
            if(!product){
                errorThrewer(404,'Could not get the product');
            }
            if(req.body.imageUrl !== product.image){
                Products.clearImage(product.image);
            }
            product.name = req.body.name;
            product.price = req.body.price;
            product.image = req.body.imageUrl;
            const catId = mongoose.Types.ObjectId(req.body.categoryId);
            product.categoryId = catId

            await product.save();
            res.status(200).send(product);
        } catch (error) {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        }
        
    }

    static delete = async(req, res, next)=>{
        try {
            const id = req.params['id'];
            const prod = await Product.findById(id);
            if(!prod){
                errorThrewer(422,'Product not found');
            }
            if(prod.image){
                Products.clearImage(prod.image);
            }
            await Product.findByIdAndRemove(id);
            res.status(200).send({'message':'Deleted!'});
        } catch (error) {
            if(!error.statusCode){
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

module.exports = Products;