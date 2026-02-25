import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

import './Customer.css';

const allCategories = [
    { name: 'All', emoji: '🛒' },
    { name: 'Car Care', emoji: '🚗' },
    { name: 'Air Conditioning', emoji: '❄️' },
    { name: 'Belt & Chain Drive', emoji: '⚙️' },
    { name: 'Engine Parts', emoji: '🔩' },
    { name: 'Brake System', emoji: '🛑' },
    { name: 'Electrical', emoji: '⚡' },
    { name: 'Body Parts', emoji: '🔧' },
    { name: 'Car Accessories', emoji: '✨' },
    { name: 'Tyres', emoji: '🔵' },
    { name: 'Oils & Lubricants', emoji: '🛢️' },
    { name: 'Other', emoji: '📦' },
];

const categoryEmoji = {
    'Car Care': '🚗', 'Air Conditioning': '❄️', 'Belt & Chain Drive': '⚙️',
    'Engine Parts': '🔩', 'Brake System': '🛑', 'Electrical': '⚡',
    'Body Parts': '🔧', 'Car Accessories': '✨', 'Tyres': '🔵',
    'Oils & Lubricants': '🛢️', 'Other': '📦',
};


const Products = () => {
    const { addToCart } = useCart();
    const [toast, setToast] = useState('');
    const location = useLocation();


    const params = new URLSearchParams(location.search);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(params.get('category') || 'All');
    const [search, setSearch] = useState(params.get('search') || '');
    const [sort, setSort] = useState('default');

    // Sync URL params when navigating from homepage
    useEffect(() => {
        const p = new URLSearchParams(location.search);
        const cat = p.get('category');
        const srch = p.get('search');
        if (cat) setCategory(cat);
        if (srch) setSearch(srch);
    }, [location.search]);

    useEffect(() => {
        const controller = new AbortController();
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const q = {};
                if (category !== 'All') q.category = category;
                if (search.trim()) q.search = search.trim();
                const { data } = await api.get('/products', { params: q, signal: controller.signal });
                let sorted = [...data];
                if (sort === 'low') sorted.sort((a, b) => a.price - b.price);
                if (sort === 'high') sorted.sort((a, b) => b.price - a.price);
                if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
                setProducts(sorted);
            } catch (err) {
                if (!axios.isCancel(err)) console.error(err);
            } finally {
                setLoading(false);
            }
        };
        const t = setTimeout(fetchProducts, 300);
        return () => { clearTimeout(t); controller.abort(); };
    }, [category, search, sort]);

    return (
        <CustomerLayout>
            {toast && <div className="cp-toast">✅ {toast}</div>}
            <div className="cp-layout">

                {/* ── Filter Panel ── */}
                <aside className="cp-filter-panel">
                    <div className="cp-filter-title">🗂 Filter Products</div>
                    <div className="cp-filter-section">
                        <h4>Category</h4>
                        {allCategories.map(c => (
                            <button
                                key={c.name}
                                className={`cp-cat-btn ${category === c.name ? 'active' : ''}`}
                                onClick={() => setCategory(c.name)}
                            >
                                <span className="cp-cat-dot" />
                                {c.emoji} {c.name}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* ── Product Main ── */}
                <div className="cp-main">
                    {/* Toolbar */}
                    <div className="cp-toolbar">
                        <div className="cp-search-box">
                            <span className="cp-search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <select className="cp-sort" value={sort} onChange={e => setSort(e.target.value)}>
                            <option value="default">Sort: Default</option>
                            <option value="low">Price: Low → High</option>
                            <option value="high">Price: High → Low</option>
                            <option value="name">Name: A → Z</option>
                        </select>
                        <span className="cp-results-text">
                            {!loading && `${products.length} products`}
                        </span>
                    </div>

                    {/* Grid */}
                    <div className="cp-grid">
                        {loading ? (
                            <div className="cp-loading">
                                <div className="cp-spinner" />
                                Loading products...
                            </div>
                        ) : products.length === 0 ? (
                            <div className="cp-empty">
                                <div className="cp-empty-icon">📦</div>
                                <h3>No products found</h3>
                                <p>Try a different category or search term</p>
                            </div>
                        ) : (
                            products.map(p => (
                                <div key={p._id} className="cp-card">
                                    <div className="cp-card-img">
                                        {p.image
                                            ? <img src={p.image.startsWith('/') ? `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${p.image}` : p.image} alt={p.name} />
                                            : <span>{categoryEmoji[p.category] || '📦'}</span>
                                        }
                                        {p.mrp && p.mrp > p.price && (
                                            <div className="cp-discount-badge">
                                                {Math.round((1 - p.price / p.mrp) * 100)}% OFF
                                            </div>
                                        )}
                                        <div className={`cp-stock-badge ${p.stock > 0 ? 'in' : 'out'}`}>
                                            {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </div>
                                    </div>
                                    <div className="cp-card-body">
                                        <span className="cp-cat-tag">{p.category}</span>
                                        <div className="cp-card-name">{p.name}</div>
                                        {p.description && (
                                            <div className="cp-card-desc">{p.description}</div>
                                        )}
                                        <div className="cp-price-row">
                                            <span className="cp-price">₹{p.price.toLocaleString('en-IN')}</span>
                                            {p.mrp && p.mrp > p.price && (
                                                <span className="cp-mrp">MRP ₹{p.mrp.toLocaleString('en-IN')}</span>
                                            )}
                                        </div>
                                        <button
                                            className={`cp-card-btn ${p.stock <= 0 ? 'disabled' : ''}`}
                                            disabled={p.stock <= 0}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(p);
                                                setToast(`${p.name} added to cart!`);
                                                setTimeout(() => setToast(''), 3000);
                                            }}
                                        >
                                            {p.stock > 0 ? '➕ Add to Cart' : 'Out of Stock'}
                                        </button>


                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Products;
