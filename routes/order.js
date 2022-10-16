const express = require('express');
const router = express.Router();
const { body } = require('express-validator')
const Orders = require('../controllers/order');
const isAuth = require('../middlewares/is-auth');


router.get('', isAuth, Orders.getOrders);

router.post('', isAuth, [
    body('date')
        .trim()
        .notEmpty(),
    body('creatorId')
        .notEmpty(),
    body('items')
        .notEmpty(),
    body('totalPrice')
        .isNumeric()
        .notEmpty(),
    body('status')
        .notEmpty()
], Orders.addOrder);

// router.put('/:id')

module.exports = router;