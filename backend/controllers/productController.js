const Product = require('../models/Product');

// @desc   Get all available products
// @route  GET /api/products
// @access Public
const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query).populate('addedBy', 'name').sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error("getProducts Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get single product
// @route  GET /api/products/:id
// @access Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('addedBy', 'name');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Create a product
// @route  POST /api/products
// @access Private (Owner, Admin)
const createProduct = async (req, res) => {
    try {
        const { name, description, category, price, stock, image, discountPercentage } = req.body;
        const product = await Product.create({
            name, description, category, price, stock, image,
            discountPercentage: discountPercentage || 0,
            addedBy: req.user._id,
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc   Update a product
// @route  PUT /api/products/:id
// @access Private (Owner, Admin)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { name, description, category, price, stock, image, available, discountPercentage } = req.body;
        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.category = category ?? product.category;
        product.price = price ?? product.price;
        product.stock = stock ?? product.stock;
        product.image = image ?? product.image;
        product.available = available ?? product.available;
        product.discountPercentage = discountPercentage ?? product.discountPercentage;

        const updated = await product.save();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access Private (Owner, Admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await product.deleteOne();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get product stats
// @route  GET /api/products/stats
// @access Private (Owner, Admin)
const getProductStats = async (req, res) => {
    try {
        const total = await Product.countDocuments();
        const available = await Product.countDocuments({ available: true });
        const lowStock = await Product.countDocuments({ stock: { $lt: 5 } });
        res.json({ totalProducts: total, available, lowStock });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductStats };
