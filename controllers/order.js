const { validationResult } = require('express-validator');
const Order = require('../models/order');
const errorThrewer = require('../helpers/error');


class Orders{
    static getOrders = async(req, res, next)=>{
        try {
            const orders = await Order.find().populate('creatorId').populate('items.prodId');
            if(!orders.length > 0){
                errorThrewer(422,'No orders founded!.');
            }
            res.status(200).send(orders);
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }

    static addOrder = async(req, res, next)=>{
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty){
                errorThrewer(422, 'Validation faild.');
            }
            const order = new Order(req.body);
            await order.save();
            res.status(201).send(order);
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }
}

module.exports = Orders;