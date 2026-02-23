import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { FiUsers, FiPackage, FiCalendar, FiMessageSquare, FiBarChart2 } from 'react-icons/fi';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/users/stats').then(r => setStats(r.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const cards = [
        { label: 'Total Customers', value: stats.totalUsers, icon: <FiUsers />, cls: 'blue' },
        { label: 'Total Products', value: stats.totalProducts, icon: <FiPackage />, cls: 'orange' },
        { label: 'Total Bookings', value: stats.totalBookings, icon: <FiCalendar />, cls: 'green' },
        { label: 'Total Enquiries', value: stats.totalEnquiries, icon: <FiMessageSquare />, cls: 'yellow' },
        { label: 'Pending Bookings', value: stats.pendingBookings, icon: <FiCalendar />, cls: 'red' },
        { label: 'Open Enquiries', value: stats.openEnquiries, icon: <FiMessageSquare />, cls: 'red' },
    ];

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                <div className="page-header">
                    <h1>🛡️ Admin Dashboard</h1>
                    <p>Full system overview — manage users, products, bookings and enquiries</p>
                </div>

                {loading ? <div className="loading-spinner"><div className="spinner" /></div> : (
                    <>
                        <div className="stats-grid">
                            {cards.map(c => (
                                <div key={c.label} className="stat-card">
                                    <div className={`stat-icon ${c.cls}`}>{c.icon}</div>
                                    <div>
                                        <div className="stat-value">{c.value ?? 0}</div>
                                        <div className="stat-label">{c.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <FiBarChart2 color="var(--primary)" size={20} />
                                <h2 style={{ fontSize: 17, fontWeight: 700 }}>System Summary</h2>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
                                This is the central admin control panel for <strong style={{ color: 'var(--text-primary)' }}>Satyam Motor Parts</strong>.
                                You have full access to manage all users, products, service bookings, and customer enquiries.
                                Use the sidebar to navigate between sections.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 20 }}>
                                {[
                                    { label: 'Total Customers', val: stats.totalUsers ?? 0, color: 'var(--info)' },
                                    { label: 'Pending Actions', val: (stats.pendingBookings ?? 0) + (stats.openEnquiries ?? 0), color: 'var(--warning)' },
                                    { label: 'Total Revenue Sources', val: stats.totalProducts ?? 0, color: 'var(--primary)' },
                                ].map(s => (
                                    <div key={s.label} style={{ padding: '14px 16px', background: 'var(--bg-card2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
