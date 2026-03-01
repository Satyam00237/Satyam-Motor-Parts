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
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zip: { type: String, required: true },
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
        gstAmount: {
            type: Number,
            default: 0,
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
