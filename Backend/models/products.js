const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: {
        type: [String],
        required: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    description:{
        type:String,
        required: true,
        maxlength: 200,
        minlength: 50,
        trim: true,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum:['Vegetables', 'Fruits', 'Drinks', 'Dairy', 'Bakery', 'Grains', 'Instant']},
    price:{
        type: Number,
        required: true,
    },
    offerPrice: {
        type: Number,
        required : true
    }
})

module.exports = mongoose.model('Products', productSchema)