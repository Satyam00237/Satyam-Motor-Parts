import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { FiCalendar } from 'react-icons/fi';

const STATUSES = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        api.get('/bookings').then(r => setBookings(r.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleStatus = async (id, status) => {
        try {
            const { data } = await api.patch(`/bookings/${id}/status`, { status });
            setBookings(bookings.map(b => b._id === id ? data : b));
        } catch (err) { alert('Status update failed'); }
    };

    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                <div className="page-header">
                    <h1>📅 All Bookings</h1>
                    <p>Monitor and manage all service bookings in the system</p>
                </div>

                <div className="filter-bar">
                    <select className="select" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="all">All</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{filtered.length} booking(s)</span>
                </div>

                <div className="card">
                    {loading ? <div className="loading-spinner"><div className="spinner" /></div> : filtered.length === 0 ? (
                        <div className="empty-state"><FiCalendar size={48} /><h3>No bookings found</h3></div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr><th>#</th><th>Customer</th><th>Service</th><th>Vehicle</th><th>Date & Slot</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {filtered.map((b, i) => (
                                        <tr key={b._id}>
                                            <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{b.customer?.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.customer?.email}</div>
                                            </td>
                                            <td>{b.serviceType}</td>
                                            <td>
                                                <div>{b.vehicleNumber}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.vehicleType}</div>
                                            </td>
                                            <td>
                                                <div>{new Date(b.serviceDate).toLocaleDateString('en-IN')}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.timeSlot}</div>
                                            </td>
                                            <td>
                                                <select className="select" style={{ width: 'auto', padding: '5px 8px', fontSize: 12 }} value={b.status} onChange={e => handleStatus(b._id, e.target.value)}>
                                                    {STATUSES.map(s => (
                                                        <option key={s} value={s}>
                                                            {s === 'approved' ? 'Approved' : s.charAt(0).toUpperCase() + s.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
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

export default AdminBookings;
