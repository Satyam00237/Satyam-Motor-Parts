import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
import api from '../../services/api';
import { FiCheck } from 'react-icons/fi';
import './Customer.css';

const statusClass = {
    pending: 'pending', approved: 'approved', completed: 'completed',
    cancelled: 'cancelled', 'in-progress': 'in-progress',
    'Delivered': 'completed', 'Processing': 'in-progress', 'Shipped': 'approved'
};

const statusIcon = {
    pending: '⏳', approved: '✅', completed: '🏁',
    cancelled: '❌', 'in-progress': '🔧',
    'Delivered': '📦', 'Processing': '⚙️', 'Shipped': '🚚'
};

const OrderStatusTracker = ({ currentStatus }) => {
    const stages = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = stages.indexOf(currentStatus);

    return (
        <div className="order-tracker">
            {stages.map((stage, index) => (
                <div key={stage} className={`tracker-step ${index <= currentIndex ? 'active' : ''}`}>
                    <div className="tracker-dot">
                        {index < currentIndex && <FiCheck size={10} />}
                    </div>
                    <span className="tracker-label">{stage}</span>
                    {index < stages.length - 1 && <div className="tracker-line" />}
                </div>
            ))}
        </div>
    );
};

const BookingHistory = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'orders'

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [bookingRes, orderRes] = await Promise.all([
                    api.get('/bookings/my'),
                    api.get('/orders/my')
                ]);
                setBookings(bookingRes.data);
                setOrders(orderRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <CustomerLayout>
            <div className="bh-header">
                <div className="bh-title">📋 My Activity History</div>
                <div className="bh-sub">Track your service bookings and product orders</div>
            </div>

            <div className="history-tabs">
                <button
                    className={`history-tab ${activeTab === 'bookings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bookings')}
                >
                    🔧 Service Bookings ({bookings.length})
                </button>
                <button
                    className={`history-tab ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    🛒 Product Orders ({orders.length})
                </button>
            </div>

            {loading ? (
                <div className="cp-loading"><div className="cp-spinner" /> Loading history...</div>
            ) : activeTab === 'bookings' ? (
                bookings.length === 0 ? (
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
                                        {b.status === 'approved' ? 'Approved' : b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                orders.length === 0 ? (
                    <div className="bh-empty">
                        <div className="bh-empty-icon">🛒</div>
                        <h3>No orders yet</h3>
                        <p>Browse our products and place your first order</p>
                        <button className="bh-empty-btn" onClick={() => navigate('/customer/products')}>
                            🏁 Shop Now
                        </button>
                    </div>
                ) : (
                    <div className="bh-cards">
                        {orders.map(o => (
                            <div key={o._id} className="bh-card order-card">
                                <div className="bh-card-info">
                                    <div className="bh-service-type">
                                        {statusIcon[o.status] || '📦'} Order #{o._id.slice(-6).toUpperCase()}
                                    </div>
                                    <div className="bh-card-meta">
                                        <div className="bh-meta-item">
                                            💰 <strong>₹{o.totalAmount.toLocaleString('en-IN')}</strong> ({o.paymentMethod})
                                        </div>
                                        <div className="bh-meta-item">
                                            📅 Ordered on {new Date(o.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </div>
                                        <div className="order-items-preview">
                                            {o.items.map((item, idx) => (
                                                <div key={idx} className="order-item-tag">
                                                    <span><strong>{item.product?.name}</strong></span>
                                                    <span style={{ color: '#888' }}>x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Flipkart Style Order Tracker */}
                                        <OrderStatusTracker currentStatus={o.status} />

                                        <div className="bh-meta-item" style={{ color: '#888', fontSize: '11px', marginTop: '10px' }}>
                                            📍 Delivered to: {o.shippingAddress.street}, {o.shippingAddress.city}
                                        </div>
                                    </div>
                                </div>
                                <div className="bh-card-status-col">
                                    <span className={`bh-status ${statusClass[o.status] || 'pending'}`}>
                                        {o.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </CustomerLayout>
    );
};

export default BookingHistory;
