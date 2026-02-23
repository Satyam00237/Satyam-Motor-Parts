const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false, // Optional for walk-in/offline customers
        },
        orderType: {
            type: String,
            enum: ['Online', 'Offline'],
            default: 'Online',
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number, // Price at time of purchase
                    required: true,
                },
            },
        ],
        shippingAddress: {
            fullName: { type: String, required: false },
            phone: { type: String, required: false },
            street: { type: String, required: false },
            city: { type: String, required: false },
            state: { type: String, required: false },
            zip: { type: String, required: false },
        },
        paymentMethod: {
            type: String,
            enum: ['COD', 'Online', 'Cash', 'Card', 'UPI'],
            default: 'COD',
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Completed'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
