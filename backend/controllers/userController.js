const User = require('../models/User');
const Booking = require('../models/Booking');
const Product = require('../models/Product');
const Enquiry = require('../models/Enquiry');

// @desc   Get all users
// @route  GET /api/users
// @access Private (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get user by ID
// @route  GET /api/users/:id
// @access Private (Admin)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update user role
// @route  PATCH /api/users/:id/role
// @access Private (Admin)
const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = req.body.role || user.role;
        const updated = await user.save();
        res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc   Delete user
// @route  DELETE /api/users/:id
// @access Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get overall dashboard stats (Admin)
// @route  GET /api/users/stats
// @access Private (Admin)
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'customer' });
        const totalProducts = await Product.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalEnquiries = await Enquiry.countDocuments();
        const openEnquiries = await Enquiry.countDocuments({ status: 'open' });
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        res.json({ totalUsers, totalProducts, totalBookings, totalEnquiries, openEnquiries, pendingBookings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, getUserById, updateUserRole, deleteUser, getAdminStats };
