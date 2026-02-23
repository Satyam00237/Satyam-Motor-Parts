const Enquiry = require('../models/Enquiry');

// @desc   Create enquiry
// @route  POST /api/enquiries
// @access Private (Customer)
const createEnquiry = async (req, res) => {
    try {
        const { subject, message, type } = req.body;
        const enquiry = await Enquiry.create({
            customer: req.user._id,
            subject,
            message,
            type,
        });
        const populated = await enquiry.populate('customer', 'name email phone');
        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc   Get my enquiries
// @route  GET /api/enquiries/my
// @access Private (Customer)
const getMyEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find({ customer: req.user._id })
            .populate('customer', 'name email')
            .sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all enquiries
// @route  GET /api/enquiries
// @access Private (Owner, Admin)
const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find()
            .populate('customer', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update enquiry status / reply
// @route  PATCH /api/enquiries/:id
// @access Private (Owner, Admin)
const updateEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id);
        if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

        enquiry.status = req.body.status || enquiry.status;
        enquiry.reply = req.body.reply || enquiry.reply;

        const updated = await enquiry.save();
        await updated.populate('customer', 'name email phone');
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc   Delete an enquiry
// @route  DELETE /api/enquiries/:id
// @access Private (Admin)
const deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id);
        if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
        await enquiry.deleteOne();
        res.json({ message: 'Enquiry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createEnquiry, getMyEnquiries, getAllEnquiries, updateEnquiry, deleteEnquiry };
