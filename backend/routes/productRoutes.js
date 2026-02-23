const express = require('express');
const router = express.Router();
const {
    getProducts, getProductById, createProduct,
    updateProduct, deleteProduct, getProductStats,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.get('/stats', protect, authorize('owner', 'admin'), getProductStats);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('owner', 'admin'), createProduct);

// Upload route
router.post('/upload', protect, authorize('owner', 'admin'), upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

router.put('/:id', protect, authorize('owner', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProduct);

module.exports = router;
