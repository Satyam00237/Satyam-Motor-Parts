import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import OwnerLayout from '../../components/OwnerLayout';
import api from '../../services/api';
import { FiCalendar } from 'react-icons/fi';

const STATUSES = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

const OwnerBookings = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialStatus = queryParams.get('status');

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(initialStatus || 'all');

    useEffect(() => {
        api.get('/bookings')
            .then(r => setBookings(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (initialStatus) setFilter(initialStatus);
        else setFilter('all');
    }, [initialStatus]);


    const handleStatus = async (id, status) => {
        try {
            const { data } = await api.patch(`/bookings/${id}/status`, { status });
            setBookings(bookings.map(b => b._id === id ? data : b));
        } catch (err) {
            console.error('Status update failed:', err);
            alert(err.response?.data?.message || 'Failed to update status. Check console for details.');
        }
    };

    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

    return (
        <OwnerLayout
            title="📅 Service Bookings"
            subtitle="Manage and update customer service appointments"
            backTo="/owner/dashboard"
            actions={
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>{filtered.length} booking(s)</span>
                    <select
                        className="ol-select"
                        style={{ width: 'auto', padding: '8px 12px' }}
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    >
                        <option value="all">All Bookings</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                </div>
            }
        >
            <div className="ol-card" style={{ padding: 0 }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}>
                        <div className="spinner" style={{ margin: '0 auto' }} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <FiCalendar size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                        <h3>No bookings found</h3>
                    </div>
                ) : (
                    <div className="ol-table-wrap">
                        <table className="ol-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Service</th>
                                    <th>Vehicle</th>
                                    <th>Date & Slot</th>
                                    <th>Notes</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(b => (
                                    <tr key={b._id}>
                                        <td>
                                            <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{b.customer?.name}</div>
                                            <div style={{ fontSize: 12, color: '#888' }}>{b.customer?.phone}</div>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{b.serviceType}</td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{b.vehicleNumber}</div>
                                            <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase' }}>{b.vehicleType}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{new Date(b.serviceDate).toLocaleDateString('en-IN')}</div>
                                            <div style={{ fontSize: 12, color: '#ff6b35' }}>{b.timeSlot}</div>
                                        </td>
                                        <td style={{ color: '#888', fontSize: 13, maxWidth: 160, whiteSpace: 'normal', lineHeight: 1.4 }}>
                                            {b.notes || '—'}
                                        </td>
                                        <td>
                                            <select
                                                className="ol-select"
                                                style={{ width: 'auto', padding: '6px 10px', fontSize: 12, fontWeight: 600 }}
                                                value={b.status}
                                                onChange={e => handleStatus(b._id, e.target.value)}
                                            >
                                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </OwnerLayout>
    );
};

export default OwnerBookings;

