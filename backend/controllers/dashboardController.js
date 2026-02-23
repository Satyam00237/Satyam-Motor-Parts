const Product = require('../models/Product');
const Booking = require('../models/Booking');
const Order = require('../models/Order');

// @desc   Get consolidated dashboard stats
// @route  GET /api/dashboard/summary
// @access Private (Owner, Admin)
const getDashboardSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const firstDayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstDayYear = new Date(today.getFullYear(), 0, 1);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Fetch all stats in parallel
        const [
            totalProducts,
            lowStock,
            totalBookings,
            recentBookings,
            todayStats,
            monthStats,
            yearStats,
            chartStats
        ] = await Promise.all([
            Product.countDocuments(),
            Product.countDocuments({ stock: { $lt: 5 } }),
            Booking.countDocuments(),
            Booking.find().populate('customer', 'name').sort({ createdAt: -1 }).limit(6),
            Order.aggregate([
                { $match: { createdAt: { $gte: today }, status: { $in: ['Delivered', 'Completed'] } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            Order.aggregate([
                { $match: { createdAt: { $gte: firstDayMonth }, status: { $in: ['Delivered', 'Completed'] } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            Order.aggregate([
                { $match: { createdAt: { $gte: firstDayYear }, status: { $in: ['Delivered', 'Completed'] } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            Order.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $in: ['Delivered', 'Completed'] } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        revenue: { $sum: '$totalAmount' }
                    }
                },
                { $sort: { _id: 1 } }
            ])
        ]);

        // Process Chart Data
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
            totalProducts,
            lowStock,
            totalBookings,
            recentBookings,
            todayRevenue: todayStats[0]?.total || 0,
            monthRevenue: monthStats[0]?.total || 0,
            yearRevenue: yearStats[0]?.total || 0,
            chartData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardSummary };
