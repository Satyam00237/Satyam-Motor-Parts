const Booking = require('../models/Booking');

// @desc   Create a booking
// @route  POST /api/bookings
// @access Private (Customer)
const createBooking = async (req, res) => {
    try {
        const { vehicleType, vehicleNumber, serviceType, serviceDate, timeSlot, notes } = req.body;

        // Check if slot already booked for this date
        const existing = await Booking.findOne({
            serviceDate: new Date(serviceDate),
            timeSlot,
            status: { $ne: 'cancelled' }
        });

        if (existing) {
            return res.status(400).json({ message: 'This time slot is already booked. Please choose another.' });
        }

        const booking = await Booking.create({
            customer: req.user._id,
            vehicleType,
            vehicleNumber,
            serviceType,
            serviceDate,
            timeSlot,
            notes,
        });

        const populated = await booking.populate('customer', 'name email phone');
        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc   Get booked slots for a date
// @route  GET /api/bookings/booked-slots
// @access Private
const getBookedSlots = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ message: 'Date is required' });

        const bookings = await Booking.find({
            serviceDate: new Date(date),
            status: { $ne: 'cancelled' }
        }).select('timeSlot');

        const bookedSlots = bookings.map(b => b.timeSlot);
        res.json(bookedSlots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get customer's own bookings
// @route  GET /api/bookings/my
// @access Private (Customer)
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ customer: req.user._id })
            .populate('customer', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all bookings
// @route  GET /api/bookings
// @access Private (Owner, Admin)
const getAllBookings = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 0;
        const bookings = await Booking.find()
            .populate('customer', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(limit);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update booking status
// @route  PATCH /api/bookings/:id/status
// @access Private (Owner, Admin)
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        console.log(`[StatusUpdate] Attempting to update Booking ${req.params.id} to status: ${status}`);

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            console.log(`[StatusUpdate] Booking not found: ${req.params.id}`);
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = status || booking.status;
        await booking.save();
        console.log(`[StatusUpdate] Successfully updated Booking ${req.params.id}`);

        const updated = await Booking.findById(req.params.id).populate('customer', 'name email phone');
        res.json(updated);
    } catch (error) {
        console.error(`[StatusUpdate] Error updating booking ${req.params.id}:`, error);
        res.status(400).json({ message: error.message });
    }
};



// @desc   Delete a booking (customer cancel or admin delete)
// @route  DELETE /api/bookings/:id
// @access Private
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Customer can only cancel their own booking
        if (req.user.role === 'customer' && booking.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this booking' });
        }

        await booking.deleteOne();
        res.json({ message: 'Booking removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get booking stats
// @route  GET /api/bookings/stats
// @access Private (Owner, Admin)
const getBookingStats = async (req, res) => {
    try {
        const total = await Booking.countDocuments();
        const pending = await Booking.countDocuments({ status: 'pending' });
        const approved = await Booking.countDocuments({ status: 'approved' });
        const completed = await Booking.countDocuments({ status: 'completed' });
        res.json({ totalBookings: total, pending, approved, completed });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus,
    deleteBooking,
    getBookingStats,
    getBookedSlots
};
