const express = require('express');
const router = express.Router();
const {
    createEnquiry, getMyEnquiries, getAllEnquiries, updateEnquiry, deleteEnquiry,
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my', protect, authorize('customer'), getMyEnquiries);
router.get('/', protect, authorize('owner', 'admin'), getAllEnquiries);
router.post('/', protect, authorize('customer'), createEnquiry);
router.patch('/:id', protect, authorize('owner', 'admin'), updateEnquiry);
router.delete('/:id', protect, authorize('admin'), deleteEnquiry);

module.exports = router;
