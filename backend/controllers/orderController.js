const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc   Create an order
// @route  POST /api/orders
// @access Private (Customer)
const createOrder = async (req, res) => {
    try {
        console.log('[OrderDebug] Starting createOrder...');
        const { items, shippingAddress, paymentMethod, totalAmount, orderType, guestInfo } = req.body;
        console.log('[OrderDebug] Body:', JSON.stringify(req.body, null, 2));

        if (!items || items.length === 0) {
            console.log('[OrderDebug] Error: No items in order');
            return res.status(400).json({ message: 'No items in order' });
        }

        const isOffline = orderType === 'Offline';
        console.log(`[OrderDebug] Order type: ${orderType || 'Online'}, IsOffline: ${isOffline}`);
        console.log(`[OrderDebug] User ID from req.user: ${req.user?._id}`);

        const order = await Order.create({
            customer: isOffline ? null : req.user?._id,
            items,
            shippingAddress: isOffline ? {
                fullName: guestInfo?.name || 'Walk-in Customer',
                phone: guestInfo?.phone || 'N/A',
                street: 'In-store',
                city: 'Local',
                state: 'Rajasthan',
                zip: 'Local'
            } : shippingAddress,
            paymentMethod,
            totalAmount,
            orderType: orderType || 'Online',
            status: isOffline ? 'Completed' : 'Pending'
        });

        console.log(`[OrderDebug] Order record created in DB: ${order._id}`);

        // Optional: Update product stock here if needed
        for (const item of items) {
            console.log(`[OrderDebug] Updating stock for product: ${item.product}, quantity: -${item.quantity}`);
            const updatedProduct = await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            }, { new: true });
            if (!updatedProduct) {
                console.log(`[OrderDebug] WARNING: Product not found during stock update: ${item.product}`);
            } else {
                console.log(`[OrderDebug] New stock for ${item.product}: ${updatedProduct.stock}`);
            }
        }

        const populated = await order.populate([
            { path: 'customer', select: 'name email phone' },
            { path: 'items.product', select: 'name image' }
        ]);

        console.log(`[OrderDebug] Order populated and ready to return`);
        res.status(201).json(populated);
    } catch (error) {
        console.error('[OrderDebug] CRITICAL ERROR in createOrder:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc   Get customer's own orders
// @route  GET /api/orders/my
// @access Private (Customer)
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('items.product', 'name image')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all orders
// @route  GET /api/orders
// @access Private (Owner, Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customer', 'name email phone')
            .populate('items.product', 'name image')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update order status
// @route  PATCH /api/orders/:id/status
// @access Private (Owner, Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        console.log(`[OrderUpdate] Attempting to update Order ${req.params.id} to status: ${status}`);

        const order = await Order.findById(req.params.id);
        if (!order) {
            console.log(`[OrderUpdate] Order not found: ${req.params.id}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status || order.status;
        await order.save();
        console.log(`[OrderUpdate] Successfully updated Order ${req.params.id}`);

        const updated = await Order.findById(req.params.id).populate([
            { path: 'customer', select: 'name email phone' },
            { path: 'items.product', select: 'name image' }
        ]);

        res.json(updated);
    } catch (error) {
        console.error(`[OrderUpdate] Error updating order ${req.params.id}:`, error);
        res.status(400).json({ message: error.message });
    }
};


const getOrderStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstDayYear = new Date(today.getFullYear(), 0, 1);

        // revenue for today
        const todayStats = await Order.aggregate([
            { $match: { createdAt: { $gte: today }, status: { $in: ['Delivered', 'Completed'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        // revenue for month
        const monthStats = await Order.aggregate([
            { $match: { createdAt: { $gte: firstDayMonth }, status: { $in: ['Delivered', 'Completed'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        // revenue for year
        const yearStats = await Order.aggregate([
            { $match: { createdAt: { $gte: firstDayYear }, status: { $in: ['Delivered', 'Completed'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        // Chart data for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const chartStats = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $in: ['Delivered', 'Completed'] } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Fill in missing days for chart
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const match = chartStats.find(s => s._id === dateStr);
            chartData.push({
                date: new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                revenue: match ? match.revenue : 0
            });
        }

        res.json({
            todayRevenue: todayStats[0]?.total || 0,
            monthRevenue: monthStats[0]?.total || 0,
            yearRevenue: yearStats[0]?.total || 0,
            chartData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderStats };
