const express = require('express');
const router = express.Router();
const { body } = require('express-validator')
const Products = require('../controllers/products')
const isAuth = require('../middlewares/is-auth');

router.get('', isAuth, Products.getProducts);


router.post('', isAuth, [
    body('name')
        .trim()
        .notEmpty(),
    body('price')
        .notEmpty(),
], Products.addProduct);

router.get('/filter', isAuth, Products.filterProducts)

router.put('/:id', isAuth, Products.updateProduct)

router.delete('/:id', isAuth, Products.delete)

module.exports = router;