const express = require('express');
const router = express.Router();
const {
    createBooking, getMyBookings, getAllBookings,
    updateBookingStatus, deleteBooking, getBookingStats,
    getBookedSlots
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('owner', 'admin'), getBookingStats);
router.get('/my', protect, authorize('customer'), getMyBookings);
router.get('/', protect, authorize('owner', 'admin'), getAllBookings);
router.post('/', protect, authorize('customer'), createBooking);
router.patch('/:id/status', protect, authorize('owner', 'admin'), updateBookingStatus);
router.get('/booked-slots', protect, getBookedSlots);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
