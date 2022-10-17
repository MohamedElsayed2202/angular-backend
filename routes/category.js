const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const errorThrewer = require('../helpers/error');
const isAuth = require('../middlewares/is-auth');


router.get('',isAuth, async(req, res, next)=>{
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
});

router.post('', isAuth, async(req, res, next)=>{
    try{
        const cat = new Category({name: req.body.name});
        await cat.save();
        res.status(201).send(cat);
    }catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
})

module.exports = router;