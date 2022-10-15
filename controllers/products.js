const { validationResult } = require('express-validator');
const Product = require('../models/product');
const errorThrewer = require('../helpers/error');

class Products{
    static addProduct = async(req, res, next)=>{
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty){
                errorThrewer(422, 'Validation faild.');
            }
            const product = new Product(req.body)
            await product.save();
            res.status(201).send({message: 'Product created!', productId: product._id});
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
}

module.exports = Products;