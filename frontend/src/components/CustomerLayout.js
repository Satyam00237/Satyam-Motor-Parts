import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../pages/customer/Customer.css';



const navCategories = [
    { label: 'All Products', cat: null },
    { label: 'Car Care', cat: 'Car Care' },
    { label: 'Engine Parts', cat: 'Engine Parts' },
    { label: 'Brake System', cat: 'Brake System' },
    { label: 'Electrical', cat: 'Electrical' },
    { label: 'Body Parts', cat: 'Body Parts' },
    { label: 'Oils & Lubricants', cat: 'Oils & Lubricants' },
    { label: 'Tyres', cat: 'Tyres' },
];


const CustomerLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const location = useLocation();
    const [search, setSearch] = useState('');


    const handleLogout = () => { logout(); navigate('/'); };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/customer/products?search=${encodeURIComponent(search)}`);
    };

    const goCategory = (cat) => {
        if (cat) navigate(`/customer/products?category=${encodeURIComponent(cat)}`);
        else navigate('/customer/products');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="cl-page">
            {/* ── Topbar ── */}
            <div className="cl-topbar">
                <span>📞 +91 7257008160</span>
                <span>🚚 Free Delivery on orders above ₹499</span>
                <span>⭐ Genuine Parts • Best Rates</span>
            </div>

            {/* ── Header ── */}
            <header className="cl-header">
                <div className="cl-header-inner">
                    {/* Logo */}
                    <div className="cl-logo" onClick={() => navigate('/')}>
                        <div className="cl-logo-icon">🔧</div>
                        <div>
                            <div className="cl-logo-name">Satyam <span>Motor Parts</span></div>
                            <div className="cl-logo-tag">Genuine Parts • Best Rates</div>
                        </div>
                    </div>

                    {/* Search */}
                    <form className="cl-search" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search for auto parts, accessories..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button type="submit">🔍 Search</button>
                    </form>

                    {/* Actions */}
                    <div className="cl-actions">
                        {user && (
                            <div className="cl-user-chip">
                                <div className="cl-avatar">{user.name?.[0]?.toUpperCase()}</div>
                                <span>{user.name?.split(' ')[0]}</span>
                            </div>
                        )}
                        <div className="cl-cart-link" onClick={() => navigate('/customer/cart')}>
                            <div className="cl-cart-icon">🛒</div>
                            {cartCount > 0 && <span className="cl-cart-badge">{cartCount}</span>}
                        </div>
                        <button className="cl-btn-outline" onClick={handleLogout}>🚪 Logout</button>

                    </div>
                </div>

                {/* ── Category Nav ── */}
                <nav className="cl-nav">
                    <div className="cl-nav-inner">
                        {navCategories.map(item => (
                            <button
                                key={item.label}
                                className={`cl-nav-link ${location.pathname === '/customer/products' && !item.cat ? 'active' : ''}`}
                                onClick={() => goCategory(item.cat)}
                            >
                                {item.label}
                            </button>
                        ))}
                        <button
                            className={`cl-nav-link ${isActive('/customer/book') ? 'active' : ''}`}
                            onClick={() => navigate('/customer/book')}
                        >
                            🔧 Book Service
                        </button>
                        <button
                            className={`cl-nav-link ${isActive('/customer/history') ? 'active' : ''}`}
                            onClick={() => navigate('/customer/history')}
                        >
                            📋 My Bookings
                        </button>
                        <button
                            className={`cl-nav-link ${isActive('/customer/enquiry') ? 'active' : ''}`}
                            onClick={() => navigate('/customer/enquiry')}
                        >
                            💬 Enquiry
                        </button>
                    </div>
                </nav>
            </header>

            {/* ── Page Content ── */}
            <main className="cl-content">
                {children}
            </main>

            {/* ── Footer ── */}
            <footer className="cl-footer">
                <div className="cl-footer-inner">
                    <div className="cl-footer-col">
                        <div className="cl-footer-logo">🔧 Satyam Motor Parts</div>
                        <p>India's trusted marketplace for genuine auto parts. Quality products, best prices.</p>
                        <div className="cl-footer-phone">📞 +91 7257008160</div>
                    </div>
                    <div className="cl-footer-col">
                        <h4>Quick Links</h4>
                        <button className="cl-footer-link" onClick={() => navigate('/customer/products')}>Products</button>
                        <button className="cl-footer-link" onClick={() => navigate('/customer/cart')}>Shopping Cart</button>
                        <button className="cl-footer-link" onClick={() => navigate('/customer/book')}>Book Service</button>

                        <button className="cl-footer-link" onClick={() => navigate('/customer/history')}>My Bookings</button>
                        <button className="cl-footer-link" onClick={() => navigate('/customer/enquiry')}>Enquiry</button>
                    </div>
                    <div className="cl-footer-col">
                        <h4>Categories</h4>
                        {navCategories.slice(1, 5).map(c => (
                            <button key={c.label} className="cl-footer-link" onClick={() => goCategory(c.cat)}>{c.label}</button>
                        ))}
                    </div>
                    <div className="cl-footer-col">
                        <h4>Policy</h4>
                        <button className="cl-footer-link">Return Policy</button>
                        <button className="cl-footer-link">Privacy Policy</button>
                        <button className="cl-footer-link">Terms of Use</button>
                        <button className="cl-footer-link">FAQ</button>
                    </div>
                </div>
                <div className="cl-footer-bottom">
                    <span>© 2024 Satyam Motor Parts. All rights reserved.</span>
                    <span>Made with ❤️ in India</span>
                </div>
            </footer>
        </div>
    );
};

export default CustomerLayout;
