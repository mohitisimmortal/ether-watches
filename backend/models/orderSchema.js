const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: Number,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            }
        }
    ],
    shippingInfo: {
        name: String,
        address: String,
        city: String,
        postalCode: Number,
        phoneNo: Number,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;