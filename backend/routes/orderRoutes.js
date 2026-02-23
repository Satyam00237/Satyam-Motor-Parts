const express = require('express');
const router = express.Router();
const {
    createOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my', protect, authorize('customer'), getMyOrders);
router.get('/stats', protect, authorize('owner', 'admin'), getOrderStats);

router.get('/', protect, authorize('owner', 'admin'), getAllOrders);
router.post('/', protect, authorize('customer', 'owner'), createOrder);
router.patch('/:id/status', protect, authorize('owner', 'admin'), updateOrderStatus);

module.exports = router;

