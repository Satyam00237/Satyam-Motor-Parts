import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { FiPackage, FiTrash2 } from 'react-icons/fi';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/products').then(r => setProducts(r.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
        } catch (err) { alert('Delete failed'); }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                <div className="page-header">
                    <h1>📦 All Products</h1>
                    <p>View and manage all products in the system</p>
                </div>

                <div className="card">
                    {loading ? <div className="loading-spinner"><div className="spinner" /></div> : products.length === 0 ? (
                        <div className="empty-state"><FiPackage size={48} /><h3>No products found</h3></div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr><th>#</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Added By</th><th>Available</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {products.map((p, i) => (
                                        <tr key={p._id}>
                                            <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{p.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.description?.slice(0, 50)}...</div>
                                            </td>
                                            <td><span className="badge badge-confirmed">{p.category}</span></td>
                                            <td style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{p.price.toLocaleString('en-IN')}</td>
                                            <td style={{ color: p.stock < 5 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>{p.stock}</td>
                                            <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{p.addedBy?.name || 'N/A'}</td>
                                            <td>
                                                <span className={`badge ${p.available ? 'badge-completed' : 'badge-cancelled'}`}>
                                                    {p.available ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
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

export default AdminProducts;
