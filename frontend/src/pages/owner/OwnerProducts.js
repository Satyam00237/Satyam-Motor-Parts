import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import OwnerLayout from '../../components/OwnerLayout';
import api from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiX, FiCheck, FiSearch, FiImage } from 'react-icons/fi';

const CATEGORIES = ['Engine Parts', 'Brakes', 'Electrical', 'Body Parts', 'Tyres', 'Oils & Lubricants', 'Accessories', 'Other'];

const emptyForm = { name: '', description: '', category: 'Engine Parts', price: '', stock: '', image: '', available: true, discountPercentage: 0 };

const OwnerProducts = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialFilter = queryParams.get('filter');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [stockFilter, setStockFilter] = useState(initialFilter === 'low-stock');
    const [searchTerm, setSearchTerm] = useState('');

    const [imageMethod, setImageMethod] = useState('url'); // 'url' or 'upload'
    const [uploading, setUploading] = useState(false);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchProducts();
        if (initialFilter === 'low-stock') setStockFilter(true);
    }, [initialFilter]);

    const displayedProducts = products.filter(p => {
        const matchesStock = stockFilter ? p.stock < 5 : true;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStock && matchesSearch;
    });



    const openAdd = () => {
        setEditing(null);
        setForm(emptyForm);
        setImageMethod('url');
        setError('');
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEditing(p);
        setForm({
            name: p.name,
            description: p.description,
            category: p.category,
            price: p.price,
            stock: p.stock,
            image: p.image,
            available: p.available,
            discountPercentage: p.discountPercentage || 0
        });
        setImageMethod(p.image?.startsWith('/') ? 'upload' : 'url');
        setError('');
        setShowModal(true);
    };

    const handleChange = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: val });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError('');
        const formData = new FormData();
        formData.append('image', file);

        try {
            const { data } = await api.post('/products/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setForm({ ...form, image: data.imageUrl });
        } catch (err) {
            setError('Image upload failed. Try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true); setError('');
        try {
            if (editing) await api.put(`/products/${editing._id}`, form);
            else await api.post('/products', form);
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
        } catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
    };

    const toggleAvailable = async (p) => {
        try {
            const { data } = await api.put(`/products/${p._id}`, { available: !p.available });
            setProducts(products.map(pr => pr._id === p._id ? data : pr));
        } catch (err) { console.error(err); }
    };

    return (
        <OwnerLayout
            title="📦 Products"
            subtitle="Add, update, and manage your inventory"
            backTo="/owner/dashboard"
            actions={
                <button className="ol-btn ol-btn-primary" onClick={openAdd}>
                    <FiPlus /> Add Product
                </button>
            }
        >
            {loading ? (
                <div className="ol-card" style={{ textAlign: 'center', padding: '100px' }}>
                    <div className="spinner" style={{ margin: '0 auto' }} />
                </div>
            ) : products.length === 0 ? (
                <div className="ol-card" style={{ textAlign: 'center', padding: '60px' }}>
                    <FiPackage size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                    <h3>No products yet</h3>
                    <p style={{ color: '#888' }}>Capture the market by adding your first product.</p>
                </div>
            ) : (
                <div className="ol-card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                        <div className="ol-search-box">
                            <FiSearch />
                            <input
                                placeholder="Search products by name or category..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {stockFilter && (
                        <div style={{ background: '#fef2f2', padding: '12px 20px', borderBottom: '1px solid #fee2e2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#dc2626', fontSize: 13, fontWeight: 600 }}>Showing Products with Low Stock (&lt;5)</span>
                            <button className="ol-btn ol-btn-outline" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => setStockFilter(false)}>Show All</button>
                        </div>
                    )}
                    <div className="ol-table-wrap">
                        <table className="ol-table">
                            <thead>
                                <tr><th style={{ width: '60px' }}>Img</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {displayedProducts.map(p => (
                                    <tr key={p._id}>
                                        <td>
                                            <div style={{ width: 45, height: 45, borderRadius: 6, overflow: 'hidden', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee' }}>
                                                {p.image ? (
                                                    <img
                                                        src={p.image.startsWith('/') ? `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${p.image}` : p.image}
                                                        alt=""
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <FiImage style={{ color: '#ccc' }} />
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ minWidth: 200 }}>
                                            <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{p.name}</div>
                                            <div style={{ fontSize: 12, color: '#888', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>
                                        </td>
                                        <td><span className="ol-badge confirmed">{p.category}</span></td>
                                        <td style={{ color: '#ff6b35', fontWeight: 700 }}>
                                            {p.discountPercentage > 0 ? (
                                                <div>
                                                    <div style={{ textDecoration: 'line-through', color: '#888', fontSize: 12 }}>₹{p.price.toLocaleString('en-IN')}</div>
                                                    <div>₹{(p.price * (1 - p.discountPercentage / 100)).toLocaleString('en-IN')} <span className="ol-badge confirmed" style={{ fontSize: 10, padding: '2px 6px' }}>{p.discountPercentage}% OFF</span></div>
                                                </div>
                                            ) : (
                                                `₹${p.price.toLocaleString('en-IN')}`
                                            )}
                                        </td>
                                        <td>
                                            <span style={{ color: p.stock < 5 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>{p.stock}</span>
                                        </td>
                                        <td>
                                            <button onClick={() => toggleAvailable(p)} className={`ol-badge ${p.available ? 'delivered' : 'cancelled'}`} style={{ cursor: 'pointer', border: 'none', font: 'inherit' }}>
                                                {p.available ? '✔ Active' : '✘ Inactive'}
                                            </button>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button className="ol-btn ol-btn-outline" style={{ padding: '8px 12px' }} onClick={() => openEdit(p)}><FiEdit2 /></button>
                                                <button className="ol-btn ol-btn-danger" style={{ padding: '8px 12px' }} onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="ol-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="ol-modal" onClick={e => e.stopPropagation()}>
                        <div className="ol-modal-header">
                            <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="ol-btn ol-btn-outline" style={{ padding: 8 }} onClick={() => setShowModal(false)}><FiX /></button>
                        </div>
                        {error && <div style={{ color: '#dc2626', background: '#fef2f2', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 13 }}>{error}</div>}
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>Product Name</label>
                                <input className="ol-input" name="name" value={form.name} onChange={handleChange} required />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>Description</label>
                                <textarea className="ol-textarea" name="description" value={form.description} onChange={handleChange} required style={{ minHeight: 80 }} />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>Category</label>
                                <select className="ol-select" name="category" value={form.category} onChange={handleChange}>
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>Price (₹)</label>
                                    <input className="ol-input" type="number" name="price" value={form.price} onChange={handleChange} min="0" required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>Discount (%)</label>
                                    <input className="ol-input" type="number" name="discountPercentage" value={form.discountPercentage} onChange={handleChange} min="0" max="100" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>Stock</label>
                                    <input className="ol-input" type="number" name="stock" value={form.stock} onChange={handleChange} min="0" required />
                                </div>
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Product Image</label>

                                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                                    <button
                                        type="button"
                                        className={`ol-btn ${imageMethod === 'upload' ? 'ol-btn-primary' : 'ol-btn-outline'}`}
                                        style={{ flex: 1, padding: '8px', fontSize: 12 }}
                                        onClick={() => setImageMethod('upload')}
                                    >
                                        Upload Photo
                                    </button>
                                    <button
                                        type="button"
                                        className={`ol-btn ${imageMethod === 'url' ? 'ol-btn-primary' : 'ol-btn-outline'}`}
                                        style={{ flex: 1, padding: '8px', fontSize: 12 }}
                                        onClick={() => setImageMethod('url')}
                                    >
                                        Image URL
                                    </button>
                                </div>

                                {imageMethod === 'upload' ? (
                                    <div style={{ padding: '16px', border: '2px dashed #ddd', borderRadius: 8, textAlign: 'center' }}>
                                        <input
                                            type="file"
                                            id="product-image"
                                            hidden
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="product-image" style={{ cursor: 'pointer', display: 'block' }}>
                                            {uploading ? (
                                                <span style={{ fontSize: 13, color: '#ff6b35', fontWeight: 600 }}>Uploading...</span>
                                            ) : (
                                                <div style={{ color: '#666' }}>
                                                    <div style={{ fontSize: 24, marginBottom: 4 }}>📸</div>
                                                    <div style={{ fontSize: 12, fontWeight: 600 }}>Click to select photo</div>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                ) : (
                                    <input
                                        className="ol-input"
                                        name="image"
                                        value={form.image}
                                        onChange={handleChange}
                                        placeholder="Paste image URL here (e.g. https://...)"
                                    />
                                )}

                                {form.image && (
                                    <div style={{ marginTop: 12, position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid #eee' }}>
                                        <img
                                            src={form.image.startsWith('/') ? `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${form.image}` : form.image}
                                            alt="Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fdfdfd' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setForm({ ...form, image: '' })}
                                            style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}
                                        >
                                            <FiX />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                                <input type="checkbox" id="available" name="available" checked={form.available} onChange={handleChange} style={{ width: 18, height: 18, accentColor: '#ff6b35' }} />
                                <label htmlFor="available" style={{ fontSize: 14, fontWeight: 500, color: '#444', cursor: 'pointer' }}>Available for sale</label>
                            </div>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                <button type="button" className="ol-btn ol-btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="ol-btn ol-btn-primary" style={{ flex: 2 }} disabled={saving}><FiCheck /> {saving ? 'Saving...' : 'Save Product'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </OwnerLayout>
    );
};

export default OwnerProducts;

