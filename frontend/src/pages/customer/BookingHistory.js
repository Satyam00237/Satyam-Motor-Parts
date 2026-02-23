import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
import api from '../../services/api';
import './Customer.css';

const statusClass = {
    pending: 'pending', confirmed: 'confirmed', completed: 'completed',
    cancelled: 'cancelled', 'in-progress': 'in-progress',
};

const statusIcon = {
    pending: '⏳', confirmed: '✅', completed: '🏁',
    cancelled: '❌', 'in-progress': '🔧',
};

const BookingHistory = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/bookings/my');
                setBookings(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    return (
        <CustomerLayout>
            <div className="bh-header">
                <div className="bh-title">📋 My Bookings</div>
                <div className="bh-sub">Track and manage all your vehicle service appointments</div>
            </div>

            {loading ? (
                <div className="cp-loading"><div className="cp-spinner" /> Loading bookings...</div>
            ) : bookings.length === 0 ? (
                <div className="bh-empty">
                    <div className="bh-empty-icon">📋</div>
                    <h3>No bookings yet</h3>
                    <p>Book a vehicle service to get started</p>
                    <button className="bh-empty-btn" onClick={() => navigate('/customer/book')}>
                        🔧 Book a Service
                    </button>
                </div>
            ) : (
                <div className="bh-cards">
                    {bookings.map(b => (
                        <div key={b._id} className="bh-card">
                            <div className="bh-card-info">
                                <div className="bh-service-type">
                                    {statusIcon[b.status] || '🔧'} {b.serviceType}
                                </div>
                                <div className="bh-card-meta">
                                    <div className="bh-meta-item">
                                        🚗 <strong>{b.vehicleNumber}</strong>
                                        <span style={{ color: '#aaa', fontSize: 12 }}>({b.vehicleType})</span>
                                    </div>
                                    <div className="bh-meta-item">
                                        📅 {new Date(b.serviceDate).toLocaleDateString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </div>
                                    <div className="bh-meta-item">⏰ {b.timeSlot}</div>
                                    {b.notes && (
                                        <div className="bh-meta-item" style={{ color: '#888', fontStyle: 'italic' }}>
                                            💬 {b.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <span className={`bh-status ${statusClass[b.status] || 'pending'}`}>
                                    {b.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CustomerLayout>
    );
};

export default BookingHistory;
