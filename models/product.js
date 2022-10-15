const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    categoryId:{
        type: Schema.Types.ObjectId,
        ref: 'categories'
    }
});

module.exports = mongoose.model('Products', productSchema);