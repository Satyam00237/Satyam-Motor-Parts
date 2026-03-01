const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
        },
        type: {
            type: String,
            enum: ['product', 'service', 'general'],
            default: 'general',
        },
        status: {
            type: String,
            enum: ['open', 'replied', 'closed'],
            default: 'open',
        },
        messages: [
            {
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
