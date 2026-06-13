const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    address: {
        type: String,
        required: true
    },
    // `address` now stores the full shipping address as a single string.
    zipcode: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        enum: ['COD', 'Online'],
        default: 'COD'
    },
    orderStatus: {
        type: Boolean,
        default: false
    }
},{timestamps: true})

module.exports = mongoose.model('Order', orderSchema)