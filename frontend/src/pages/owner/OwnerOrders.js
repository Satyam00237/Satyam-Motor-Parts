import React, { useEffect, useState } from 'react';
import OwnerLayout from '../../components/OwnerLayout';
import api from '../../services/api';
import { FiPackage } from 'react-icons/fi';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Completed'];

const OwnerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        api.get('/orders')
            .then(r => setOrders(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleStatus = async (id, status) => {
        try {
            const { data } = await api.patch(`/orders/${id}/status`, { status });
            setOrders(orders.map(o => o._id === id ? data : o));
        } catch (err) {
            console.error('Order status update failed:', err);
            alert(err.response?.data?.message || 'Failed to update status. Check console for details.');
        }
    };

    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    return (
        <OwnerLayout
            title="📦 Product Orders"
            subtitle="Manage customer orders and update delivery status"
            backTo="/owner/dashboard"
            actions={
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>{filtered.length} order(s)</span>
                    <select
                        className="ol-select"
                        style={{ width: 'auto', padding: '8px 12px' }}
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
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
                        <FiPackage size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                        <h3>No orders found</h3>
                    </div>
                ) : (
                    <div className="ol-table-wrap">
                        <table className="ol-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Address</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(o => (
                                    <tr key={o._id}>
                                        <td>
                                            <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{o.shippingAddress?.fullName}</div>
                                            <div style={{ fontSize: 12, color: '#888' }}>{o.shippingAddress?.phone}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: 13, color: '#444' }}>
                                                {o.items.map((item, i) => (
                                                    <div key={i}>• {item.product?.name || 'Product'} x {item.quantity}</div>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 700, color: '#ff6b35' }}>₹{o.totalAmount.toLocaleString('en-IN')}</td>
                                        <td>
                                            <div style={{ fontSize: 12, maxWidth: 200, color: '#888', lineHeight: 1.5 }}>
                                                {o.shippingAddress?.street}, {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.zip}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="ol-badge" style={{ background: '#f8f8f8', color: '#666', border: '1px solid #eee' }}>{o.paymentMethod}</span>
                                        </td>
                                        <td>
                                            <select
                                                className="ol-select"
                                                style={{ width: 'auto', padding: '6px 10px', fontSize: 12, fontWeight: 600 }}
                                                value={o.status}
                                                onChange={e => handleStatus(o._id, e.target.value)}
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

export default OwnerOrders;

