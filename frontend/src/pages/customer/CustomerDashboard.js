import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FiCalendar, FiMessageSquare, FiClock } from 'react-icons/fi';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ bookings: 0, pending: 0, enquiries: 0 });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsRes, enquiriesRes] = await Promise.all([
                    api.get('/bookings/my'),
                    api.get('/enquiries/my'),
                ]);
                const bookings = bookingsRes.data;
                const enquiries = enquiriesRes.data;
                setStats({
                    bookings: bookings.length,
                    pending: bookings.filter(b => b.status === 'pending').length,
                    enquiries: enquiries.length,
                });
                setRecentBookings(bookings.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statusBadge = (s) => <span className={`badge badge-${s}`}>{s}</span>;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                <div className="page-header">
                    <h1>👋 Welcome, {user?.name?.split(' ')[0]}!</h1>
                    <p>Here's what's happening with your vehicle services</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon orange"><FiCalendar /></div>
                        <div><div className="stat-value">{stats.bookings}</div><div className="stat-label">Total Bookings</div></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon yellow"><FiClock /></div>
                        <div><div className="stat-value">{stats.pending}</div><div className="stat-label">Pending Bookings</div></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon blue"><FiMessageSquare /></div>
                        <div><div className="stat-value">{stats.enquiries}</div><div className="stat-label">My Enquiries</div></div>
                    </div>
                </div>

                <div className="card">
                    <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Recent Bookings</h2>
                    {loading ? (
                        <div className="loading-spinner"><div className="spinner" /> Loading...</div>
                    ) : recentBookings.length === 0 ? (
                        <div className="empty-state">
                            <FiCalendar size={40} />
                            <h3>No bookings yet</h3>
                            <p>Book your first vehicle service to get started</p>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Service Type</th>
                                        <th>Vehicle</th>
                                        <th>Date</th>
                                        <th>Time Slot</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map(b => (
                                        <tr key={b._id}>
                                            <td>{b.serviceType}</td>
                                            <td>{b.vehicleNumber} <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>({b.vehicleType})</span></td>
                                            <td>{new Date(b.serviceDate).toLocaleDateString('en-IN')}</td>
                                            <td>{b.timeSlot}</td>
                                            <td>{statusBadge(b.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CustomerDashboard;
