const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Engine Parts', 'Brakes', 'Electrical', 'Body Parts', 'Tyres', 'Oils & Lubricants', 'Accessories', 'Other'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0,
        },
        stock: {
            type: Number,
            required: [true, 'Stock quantity is required'],
            min: 0,
            default: 0,
        },
        image: {
            type: String,
            default: '',
        },
        available: {
            type: Boolean,
            default: true,
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        discountPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
