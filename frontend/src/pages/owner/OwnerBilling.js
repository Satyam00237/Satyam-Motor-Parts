import React, { useEffect, useState } from 'react';
import OwnerLayout from '../../components/OwnerLayout';
import api from '../../services/api';
import { FiSearch, FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiUser, FiCheckCircle } from 'react-icons/fi';

const OwnerBilling = () => {
    const [products, setProducts] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [guestInfo, setGuestInfo] = useState({ name: '', phone: '' });
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        api.get('/products')
            .then(r => setProducts(r.data))
            .catch(console.error);
        // .finally(() => setLoading(false));
    }, []);

    const categories = ['All', 'Engine Parts', 'Brakes', 'Electrical', 'Body Parts', 'Tyres', 'Oils & Lubricants', 'Accessories', 'Other'];

    const addToCart = (product) => {
        const existing = cart.find(item => item._id === product._id);
        if (existing) {
            setCart(cart.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item._id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => setCart(cart.filter(item => item._id !== id));

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return alert('Add items to cart first');
        setSaving(true);
        try {
            const orderData = {
                orderType: 'Offline',
                items: cart.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: total,
                paymentMethod,
                guestInfo
            };
            await api.post('/orders', orderData);
            setSuccess(true);
            setCart([]);
            setGuestInfo({ name: '', phone: '' });
        } catch (err) {
            console.error(err);
            alert('Checkout failed');
        } finally {
            setSaving(false);
        }
    };

    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (success) {
        return (
            <OwnerLayout title="🧾 Billing (POS)" backTo="/owner/dashboard">
                <div className="ol-card" style={{ textAlign: 'center', padding: '80px 20px' }}>
                    <div style={{ fontSize: 60, color: '#10b981', marginBottom: 20 }}><FiCheckCircle /></div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Bill Generated Successfully!</h2>
                    <p style={{ color: '#666', marginBottom: 30 }}>The order has been recorded and stock has been updated.</p>
                    <button className="ol-btn ol-btn-primary" onClick={() => setSuccess(false)}>Create New Bill</button>
                </div>
            </OwnerLayout>
        );
    }

    return (
        <OwnerLayout
            title="🧾 Billing (POS)"
            subtitle="Create quick bills for offline customers"
            backTo="/owner/dashboard"
        >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>

                {/* Product Section */}
                <div className="ol-card">
                    <div style={{ marginBottom: 20 }}>
                        <div className="ol-search-box" style={{ marginBottom: 16, padding: '14px 20px' }}>
                            <FiSearch style={{ fontSize: '20px' }} />
                            <input
                                type="text"
                                placeholder="Search parts by name or SKU..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ fontSize: '16px', fontWeight: 500 }}
                            />
                        </div>

                        <div className="category-scroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '25px',
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                        border: '1px solid',
                                        borderColor: selectedCategory === cat ? '#ff6b35' : '#eee',
                                        background: selectedCategory === cat ? '#ff6b35' : '#fff',
                                        color: selectedCategory === cat ? '#fff' : '#666',
                                        transition: 'all 0.2s',
                                        boxShadow: selectedCategory === cat ? '0 4px 12px rgba(255,107,53,0.2)' : 'none'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="ol-card-title" style={{ margin: 0 }}>Available Inventory</h3>
                        <span style={{ fontSize: 13, color: '#888' }}>{filtered.length} products found</span>
                    </div>

                    <div className="ol-table-wrap" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <table className="ol-table">
                            <thead>
                                <tr style={{ position: 'sticky', top: 0, zIndex: 1, background: '#f8f8f8' }}>
                                    <th>Product</th>
                                    <th>In Stock</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(p => (
                                    <tr key={p._id}>
                                        <td>
                                            <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{p.name}</div>
                                            <div style={{ fontSize: 11, color: '#888' }}>{p.category}</div>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 600, color: p.stock < 5 ? '#ef4444' : '#10b981' }}>{p.stock}</span>
                                        </td>
                                        <td style={{ fontWeight: 700 }}>₹{p.price.toLocaleString('en-IN')}</td>
                                        <td>
                                            <button
                                                className="ol-btn ol-btn-sm ol-btn-primary"
                                                onClick={() => addToCart(p)}
                                                disabled={p.stock <= 0}
                                            >
                                                <FiPlus /> Add
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                                            No products found matching your search or category
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Cart & Checkout */}
                <div style={{ position: 'sticky', top: 24 }}>
                    <div className="ol-card" style={{ marginBottom: 20 }}>
                        <h3 className="ol-card-title"><FiUser /> Customer Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 4, display: 'block' }}>Name</label>
                                <input
                                    className="ol-input"
                                    placeholder="Walk-in Customer"
                                    value={guestInfo.name}
                                    onChange={e => setGuestInfo({ ...guestInfo, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 4, display: 'block' }}>Phone</label>
                                <input
                                    className="ol-input"
                                    placeholder="Contact number"
                                    value={guestInfo.phone}
                                    onChange={e => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="ol-card">
                        <h3 className="ol-card-title"><FiShoppingCart /> Current Bill</h3>

                        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: 20 }}>
                            {cart.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: 14 }}>
                                    Cart is empty
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                            <div style={{ fontSize: 11, color: '#888' }}>₹{item.price} x {item.quantity}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', background: '#f5f5f5', borderRadius: 6 }}>
                                                <button onClick={() => updateQty(item._id, -1)} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer' }}><FiMinus size={12} /></button>
                                                <span style={{ fontSize: 12, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                                                <button onClick={() => updateQty(item._id, 1)} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer' }}><FiPlus size={12} /></button>
                                            </div>
                                            <button onClick={() => removeFromCart(item._id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}><FiTrash2 /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ background: '#f8f8f8', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ color: '#666', fontSize: 14 }}>Subtotal</span>
                                <span style={{ fontWeight: 600 }}>₹{total.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: 8 }}>
                                <span style={{ fontWeight: 800, fontSize: 18 }}>Total Bill</span>
                                <span style={{ fontWeight: 800, fontSize: 18, color: '#ff6b35' }}>₹{total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 8, display: 'block' }}>Payment Method</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {['Cash', 'Card', 'UPI'].map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setPaymentMethod(m)}
                                        style={{
                                            flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                                            border: '1px solid', borderColor: paymentMethod === m ? '#ff6b35' : '#eee',
                                            background: paymentMethod === m ? 'rgba(255,107,53,0.05)' : '#fff',
                                            color: paymentMethod === m ? '#ff6b35' : '#666',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            className="ol-btn ol-btn-primary"
                            style={{ width: '100%', padding: '14px', fontSize: 15 }}
                            disabled={cart.length === 0 || saving}
                            onClick={handleCheckout}
                        >
                            {saving ? 'Processing...' : 'Generate Bill & Complete'}
                        </button>
                    </div>
                </div>

            </div>
        </OwnerLayout>
    );
};

export default OwnerBilling;
