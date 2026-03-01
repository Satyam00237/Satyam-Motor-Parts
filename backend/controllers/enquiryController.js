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
            messages: [{
                sender: req.user._id,
                content: message,
            }],
        });
        const populated = await enquiry.populate('customer', 'name email phone');
        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc   Get enquiry by ID
// @route  GET /api/enquiries/:id
// @access Private (Customer, Owner, Admin)
const getEnquiryById = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id)
            .populate('customer', 'name email phone')
            .populate('messages.sender', 'name role');

        if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

        // Check authorization
        if (req.user.role === 'customer' && enquiry.customer._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Add reply to enquiry
// @route  POST /api/enquiries/:id/reply
// @access Private (Customer, Owner, Admin)
const addReply = async (req, res) => {
    try {
        const { content } = req.body;
        const enquiry = await Enquiry.findById(req.params.id);

        if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
        if (enquiry.status === 'closed') {
            return res.status(400).json({ message: 'This enquiry is closed and cannot be replied to.' });
        }

        // Check authorization
        if (req.user.role === 'customer' && enquiry.customer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        enquiry.messages.push({
            sender: req.user._id,
            content,
        });

        if (req.user.role === 'owner' || req.user.role === 'admin') {
            enquiry.status = 'replied';
        }

        const updated = await enquiry.save();
        const populated = await updated.populate([
            { path: 'customer', select: 'name email phone' },
            { path: 'messages.sender', select: 'name role' }
        ]);

        res.json(populated);
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
            .populate('customer', 'name email shadowName')
            .populate('messages.sender', 'name role')
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
            .populate('messages.sender', 'name role')
            .sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update enquiry status
// @route  PATCH /api/enquiries/:id
// @access Private (Owner, Admin)
const updateEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id);
        if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

        enquiry.status = req.body.status || enquiry.status;

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

module.exports = {
    createEnquiry,
    getMyEnquiries,
    getAllEnquiries,
    updateEnquiry,
    deleteEnquiry,
    getEnquiryById,
    addReply
};
