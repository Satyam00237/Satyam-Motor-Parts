import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OwnerLayout from '../../components/OwnerLayout';
import api from '../../services/api';
import { FiPackage, FiCalendar, FiAlertTriangle, FiArrowRight, FiTrendingUp, FiDollarSign, FiBarChart2 } from 'react-icons/fi';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Single consolidated call for speed
                const { data } = await api.get('/dashboard/summary');
                setStats(data);
                setRecentBookings(data.recentBookings || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const revenueCards = [
        { label: "Today's Sale", value: stats.todayRevenue, icon: <FiTrendingUp />, color: 'blue', action: () => navigate('/owner/orders') },
        { label: "This Month", value: stats.monthRevenue, icon: <FiBarChart2 />, color: 'violet', action: () => navigate('/owner/orders') },
        { label: "This Year", value: stats.yearRevenue, icon: <FiDollarSign />, color: 'indigo', action: () => navigate('/owner/orders') },
    ];

    return (
        <OwnerLayout
            title="⚙️ Owner Dashboard"
            subtitle="Manage your shop — products, bookings and revenue"
        >
            {loading ? (
                <div className="ol-card" style={{ textAlign: 'center', padding: '100px' }}>
                    <div className="spinner" style={{ margin: '0 auto' }} />
                    <p style={{ marginTop: 20, color: '#888' }}>Loading shop overview...</p>
                </div>
            ) : (
                <>
                    {/* Revenue Stats */}
                    <div style={{ marginBottom: 24 }}>
                        <h3 className="ol-card-title" style={{ marginBottom: 16 }}>💰 Sales Overview</h3>
                        <div className="ol-stats-grid">
                            {revenueCards.map((c, i) => (
                                <div key={i} className="ol-stat-card clickable" onClick={c.action}>
                                    <div className={`ol-stat-icon ${c.color}`}>{c.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div className="ol-stat-value">₹{(c.value || 0).toLocaleString('en-IN')}</div>
                                        <div className="ol-stat-label">{c.label}</div>
                                    </div>
                                    <FiArrowRight className="ol-stat-arrow" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 24 }}>
                        {/* Sales Chart */}
                        <div className="ol-card">
                            <h3 className="ol-card-title"><FiTrendingUp /> Sales Trend (Last 7 Days)</h3>
                            <div style={{ width: '100%', height: 300, marginTop: 20 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.chartData || []}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Inventory Quick View */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="ol-stat-card clickable" style={{ margin: 0 }} onClick={() => navigate('/owner/products')}>
                                <div className="ol-stat-icon orange" style={{ width: 40, height: 40, fontSize: 18 }}><FiPackage /></div>
                                <div style={{ flex: 1 }}>
                                    <div className="ol-stat-value" style={{ fontSize: 20 }}>{stats.totalProducts ?? 0}</div>
                                    <div className="ol-stat-label">Total Products</div>
                                </div>
                                <FiArrowRight className="ol-stat-arrow" />
                            </div>
                            <div className="ol-stat-card clickable" style={{ margin: 0 }} onClick={() => navigate('/owner/products?filter=low-stock')}>
                                <div className="ol-stat-icon red" style={{ width: 40, height: 40, fontSize: 18 }}><FiAlertTriangle /></div>
                                <div style={{ flex: 1 }}>
                                    <div className="ol-stat-value" style={{ fontSize: 20 }}>{stats.lowStock ?? 0}</div>
                                    <div className="ol-stat-label">Low Stock (&lt;5)</div>
                                </div>
                                <FiArrowRight className="ol-stat-arrow" />
                            </div>
                            <div className="ol-stat-card clickable" style={{ margin: 0 }} onClick={() => navigate('/owner/bookings')}>
                                <div className="ol-stat-icon blue" style={{ width: 40, height: 40, fontSize: 18 }}><FiCalendar /></div>
                                <div style={{ flex: 1 }}>
                                    <div className="ol-stat-value" style={{ fontSize: 20 }}>{stats.totalBookings ?? 0}</div>
                                    <div className="ol-stat-label">Service Bookings</div>
                                </div>
                                <FiArrowRight className="ol-stat-arrow" />
                            </div>
                        </div>
                    </div>

                    <div className="ol-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h2 className="ol-card-title" style={{ margin: 0 }}><FiCalendar /> Recent Bookings</h2>
                            <button className="ol-btn ol-btn-outline ol-btn-sm" onClick={() => navigate('/owner/bookings')}>View All</button>
                        </div>
                        {recentBookings.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                                <FiCalendar size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                                <h3>No bookings yet</h3>
                            </div>
                        ) : (
                            <div className="ol-table-wrap">
                                <table className="ol-table">
                                    <thead>
                                        <tr>
                                            <th>Customer</th>
                                            <th>Service</th>
                                            <th>Vehicle</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentBookings.map(b => (
                                            <tr key={b._id}>
                                                <td style={{ fontWeight: 600, color: '#1a1a2e' }}>{b.customer?.name}</td>
                                                <td>{b.serviceType}</td>
                                                <td>{b.vehicleNumber}</td>
                                                <td>{new Date(b.serviceDate).toLocaleDateString('en-IN')}</td>
                                                <td>
                                                    <span className={`ol-badge ${b.status}`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </OwnerLayout>
    );
};

export default OwnerDashboard;

