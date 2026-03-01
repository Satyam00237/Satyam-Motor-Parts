import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Customer.css';

const Cart = () => {
    const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Review, 2: Checkout, 3: Success
    const [isAddressConfirmed, setIsAddressConfirmed] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: 'Rajasthan',
        zip: '',
        paymentMethod: 'COD'
    });

    // Pre-fill user details from profile
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || '',
                phone: user.phone || '',
                street: user.street || '',
                city: user.city || '',
                state: user.state || 'Rajasthan',
                zip: user.zip || ''
            }));
            // If user has minimal address details, show as confirmed by default
            if (user.street && user.city && user.zip) {
                setIsAddressConfirmed(true);
            } else {
                setIsAddressConfirmed(false);
            }
        }
    }, [user]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const gstAmount = cartTotal * 0.18;
            const finalTotal = cartTotal + gstAmount;

            const orderData = {
                items: cart.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                shippingAddress: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip
                },
                paymentMethod: formData.paymentMethod,
                gstAmount: gstAmount,
                totalAmount: finalTotal
            };

            console.log('[CartDebug] Attempting to place order with data:', orderData);
            const response = await api.post('/orders', orderData);
            console.log('[CartDebug] Order placed successfully:', response.data);
            clearCart();
            setStep(3);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            console.error('[CartDebug] Order failed details:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });

            if (err.response?.status === 401) {
                setError('Your session has expired. Please log in again to place your order.');
                // Optional: redirect to login after a delay
                // setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(errorMsg || 'Failed to place order. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (step === 3) {
        return (
            <CustomerLayout>
                <div className="cb-success">
                    <div className="cb-success-icon">🎉</div>
                    <h2 className="cb-title">Order Placed Successfully!</h2>
                    <p className="cb-sub">Thank you for shopping with Satyam Motor Parts. Your order is being processed.</p>
                    <button className="cb-submit" style={{ maxWidth: '300px', margin: '20px auto' }} onClick={() => navigate('/customer/products')}>
                        Continue Shopping
                    </button>
                    <button className="cl-btn-outline" style={{ display: 'block', margin: '0 auto' }} onClick={() => navigate('/customer/history')}>
                        View Order History
                    </button>
                </div>
            </CustomerLayout>
        );
    }

    if (cart.length === 0 && step !== 3) {
        return (
            <CustomerLayout>
                <div className="cp-empty">
                    <div className="cp-empty-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <button className="cb-submit" style={{ maxWidth: '250px', margin: '20px auto' }} onClick={() => navigate('/customer/products')}>
                        Browse Products
                    </button>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <div className="cb-wrap">
                <div className="cb-card">
                    {step === 1 ? (
                        <>
                            <div className="cb-header">
                                <h2 className="cb-title">Shopping Cart ({cart.length} items)</h2>
                                <p className="cb-sub">Review your items before checkout</p>
                            </div>

                            <div className="cart-list">
                                {cart.map(item => (
                                    <div key={item._id} className="cart-item">
                                        <div className="cart-item-info">
                                            <div className="cart-item-img">
                                                {item.image ? <img src={item.image.startsWith('/') ? `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${item.image}` : item.image} alt={item.name} /> : '⚙️'}
                                            </div>
                                            <div>
                                                <div className="cart-item-name">{item.name}</div>
                                                <div className="cart-item-price">
                                                    {item.discountPercentage > 0 ? (
                                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                            <span style={{ fontWeight: 700 }}>₹{item.price.toLocaleString('en-IN')}</span>
                                                            <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '11px' }}>₹{item.originalPrice.toLocaleString('en-IN')}</span>
                                                            <span style={{ background: '#f0fdf4', color: '#15803d', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>{item.discountPercentage}% OFF</span>
                                                        </div>
                                                    ) : (
                                                        `₹${item.price.toLocaleString('en-IN')}`
                                                    )}
                                                    <span style={{ fontSize: '13px', color: '#666', marginLeft: '4px' }}>x {item.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="cart-item-actions">
                                            <div className="cart-qty-ctrl">
                                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                            </div>
                                            <button className="cart-remove" onClick={() => removeFromCart(item._id)}>🗑️</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary">
                                <div className="cart-summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="cart-summary-row">
                                    <span>GST (18%)</span>
                                    <span>₹{(cartTotal * 0.18).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="cart-summary-row">
                                    <span>Delivery</span>
                                    <span style={{ color: '#16a34a' }}>FREE</span>
                                </div>
                                <div className="cart-summary-row total">
                                    <span>Total Amount</span>
                                    <span>₹{(cartTotal * 1.18).toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button className="cb-submit" onClick={() => setStep(2)}>
                                Proceed to Checkout →
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleCheckout}>
                            <div className="cb-header">
                                <h2 className="cb-title">Shipping & Payment</h2>
                                <p className="cb-sub">Confirm where we should deliver your parts</p>
                            </div>

                            {error && <div style={{ color: '#dc2626', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}

                            {isAddressConfirmed ? (
                                <div className="cart-address-summary">
                                    <div className="cas-header">
                                        <h3>Delivery Address</h3>
                                        <button type="button" onClick={() => setIsAddressConfirmed(false)}>CHANGE</button>
                                    </div>
                                    <div className="cas-content">
                                        <strong>{formData.fullName}</strong>
                                        <p>{formData.phone}</p>
                                        <p>{formData.street}, {formData.city}, {formData.state} - {formData.zip}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="cb-grid">
                                    <div className="cb-field full">
                                        <label className="cb-label">Full Name</label>
                                        <input
                                            type="text" required className="cb-input"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="cb-field full">
                                        <label className="cb-label">Phone Number</label>
                                        <input
                                            type="tel" required className="cb-input"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="Mobile number for delivery updates"
                                        />
                                    </div>
                                    <div className="cb-field full">
                                        <label className="cb-label">Street Address</label>
                                        <input
                                            type="text" required className="cb-input"
                                            value={formData.street}
                                            onChange={e => setFormData({ ...formData, street: e.target.value })}
                                            placeholder="House/Plot No, Locality"
                                        />
                                    </div>
                                    <div className="cb-field">
                                        <label className="cb-label">City</label>
                                        <input
                                            type="text" required className="cb-input"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="cb-field">
                                        <label className="cb-label">ZIP Code</label>
                                        <input
                                            type="text" required className="cb-input"
                                            value={formData.zip}
                                            onChange={e => setFormData({ ...formData, zip: e.target.value })}
                                        />
                                    </div>
                                    <div className="cb-field full" style={{ marginTop: '10px' }}>
                                        <button type="button" className="cl-btn-outline" onClick={() => setIsAddressConfirmed(true)} style={{ width: '100%' }}>
                                            Confirm Address
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="cb-field full" style={{ marginTop: '20px' }}>
                                <label className="cb-label">Payment Method</label>
                                <select
                                    className="cb-select"
                                    value={formData.paymentMethod}
                                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                                >
                                    <option value="COD">Cash on Delivery (Pay when received)</option>
                                    <option value="Online">Online / UPI (Not yet integrated)</option>
                                </select>
                            </div>

                            <div className="checkout-footer">
                                <p>You will pay <strong>₹{(cartTotal * 1.18).toLocaleString('en-IN')}</strong> upon delivery.</p>
                                <div className="checkout-btns">
                                    <button type="button" className="cl-btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)} disabled={loading}>
                                        Back
                                    </button>
                                    <button type="submit" className="cb-submit" style={{ flex: 2, margin: 0 }} disabled={loading}>
                                        {loading ? 'Placing Order...' : 'Confirm Order'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Cart;
