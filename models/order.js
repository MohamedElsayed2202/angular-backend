const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    notes: String,

    items: [
        {
            prodId: {
                type: Schema.Types.ObjectId,
                ref:'Products',
                required: true
            },
            qty: {type: Number, required: true} 
        }
    ],
    status: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Orders', orderSchema);