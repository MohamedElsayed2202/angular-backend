const express = require('express');
const router = express.Router();
const {body} = require('express-validator')
const Products = require('../controllers/products')
router.get('', Products.getProducts)
router.post('',[
    body('name')
    .trim()
    .notEmpty(),
    body('price')
    .notEmpty(),
],Products.addProduct);

router.get('/filter',Products.filterProducts)

module.exports = router;