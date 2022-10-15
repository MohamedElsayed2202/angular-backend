const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const errorThrewer = require('../helpers/error');

router.get('',async(req, res, next)=>{
    try {
        const categories = await Category.find();
        if(!categories){
            errorThrewer(401, 'No categories added');
        }
        res.status(200).send(categories);
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
})

module.exports = router;