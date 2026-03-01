const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        vehicleType: {
            type: String,
            required: [true, 'Vehicle type is required'],
        },
        vehicleNumber: {
            type: String,
            required: [true, 'Vehicle number is required'],
        },
        serviceType: {
            type: String,
            required: [true, 'Service type is required'],
            enum: [
                'General Service', 'Oil Change', 'Brake Service', 'Brake Inspection',
                'Engine Repair', 'Engine Tune-up', 'Electrical Repair', 'Tyre Change',
                'Tyre Replacement', 'Battery Replacement', 'AC Service', 'Body Work',
                'Wheel Alignment', 'Other', 'Electrical Repair'
            ],
        },
        serviceDate: {
            type: Date,
            required: [true, 'Service date is required'],
        },
        timeSlot: {
            type: String,
            required: [true, 'Time slot is required'],
        },
        notes: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'in-progress', 'completed', 'cancelled'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
