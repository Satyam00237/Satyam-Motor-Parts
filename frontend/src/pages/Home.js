import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

// ─── Data ───────────────────────────────────────────────────────────────────

const categories = [
    { id: 1, name: 'Car Care', icon: '🚗', color: '#ff6b35', route: 'Car Care' },
    { id: 2, name: 'Air Conditioning', icon: '❄️', color: '#3b9eff', route: 'Air Conditioning' },
    { id: 3, name: 'Belt & Chain Drive', icon: '⚙️', color: '#f59e0b', route: 'Belt & Chain Drive' },
    { id: 4, name: 'Body Parts', icon: '🔧', color: '#10b981', route: 'Body Parts' },
    { id: 5, name: 'Brake System', icon: '🛑', color: '#ef4444', route: 'Brake System' },
    { id: 6, name: 'Car Accessories', icon: '✨', color: '#8b5cf6', route: 'Car Accessories' },
    { id: 7, name: 'Engine Parts', icon: '🔩', color: '#06b6d4', route: 'Engine Parts' },
    { id: 8, name: 'Electrical', icon: '⚡', color: '#eab308', route: 'Electrical' },
];


const featuredProducts = [
    { id: 1, name: 'TYRE SHINE (5 Ltr)', price: 675, mrp: 1499, discount: 54, tag: 'Best Seller', emoji: '🛞' },
    { id: 2, name: 'Effortless One Step Rubbing Compound', price: 650, mrp: 1299, discount: 49, tag: 'Top Rated', emoji: '🧴' },
    { id: 3, name: 'AutoDukan Coolant Blue', price: 110, mrp: 259, discount: 57, tag: 'Hot Deal', emoji: '🧊' },
    { id: 4, name: 'MAK ALPHA ZENITH 5W30 - 1Lt', price: 670, mrp: null, tag: 'Online Offer', emoji: '🛢️' },
    { id: 5, name: 'MAK ALPHA ZENITH 5W30 - 3.5Lt', price: 2335, mrp: null, tag: 'Online Offer', emoji: '🛢️' },
    { id: 6, name: 'Engine Oil Premium', price: 459, mrp: null, tag: 'Online Offer', emoji: '⚙️' },
    { id: 7, name: 'MAK CLASSIC PLUS 5W30 - 3 Ltr', price: 1326, mrp: null, tag: 'Online Offer', emoji: '🛢️' },
    { id: 8, name: 'MULTI PURPOSE DRESSING (5 Ltr)', price: 900, mrp: 1999, discount: 54, tag: 'Top Pick', emoji: '✨' },
];

const services = [
    { name: 'PUC Info', icon: '📋', color: '#3b9eff', to: '/customer/enquiry' },
    { name: 'Car Info', icon: '🚗', color: '#ff6b35', to: '/customer/products' },
    { name: 'Garages', icon: '🏭', color: '#10b981', to: '/customer/book' },
    { name: 'Washing Center', icon: '💧', color: '#06b6d4', to: '/customer/book' },
    { name: 'Towing', icon: '🚛', color: '#f59e0b', to: '/customer/enquiry' },
    { name: 'Petrol Pump', icon: '⛽', color: '#ef4444', to: '/customer/enquiry' },
    { name: 'EV Station', icon: '🔋', color: '#8b5cf6', to: '/customer/enquiry' },
    { name: 'Insurance Info', icon: '🛡️', color: '#6366f1', to: '/customer/enquiry' },
];

const oemBrands = ['MARUTI', 'HYUNDAI', 'SKODA', 'VW', 'HONDA', 'NISSAN', 'FORD', 'MAHINDRA', 'TOYOTA', 'TATA'];
const oesBrands = ['AUTOGOLD', 'LUMAX', 'MONROE', 'MAHLE ORIGINAL', 'AUTOKOI', 'Rane', 'TVS Girling', 'VALEO', 'UNO MINDA', 'AMARON'];

const whyChooseUs = [
    { num: '01', title: 'Genuine Parts', desc: 'We recognize the paramount significance of quality and reliability in vehicle maintenance and enhancement.', icon: '✅' },
    { num: '02', title: 'Maximum Availability', desc: 'We guarantee maximum availability of products. Shop with confidence, we have everything you need, whenever you need it.', icon: '🏪' },
    { num: '03', title: 'Best Rates', desc: 'We offer the best rates on all products. Enjoy unbeatable prices without compromising quality.', icon: '💰' },
    { num: '04', title: 'On Time Delivery', desc: 'We provide the fastest delivery. Receive your orders promptly, ensuring you get what you need when you need it.', icon: '🚀' },
];

// ─── Main Component ──────────────────────────────────────────────────────────

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [currentBanner, setCurrentBanner] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const banners = [
        { title: 'Genuine Auto Parts', subtitle: 'Get the best quality spare parts delivered to your doorstep', cta: 'Shop Now', bg: 'linear-gradient(135deg, #1a1a2e 0%, #24244a 100%)', accent: '#ff6b35' },
        { title: 'Premium Car Care', subtitle: 'Professional grade products for your vehicle maintenance', cta: 'Explore', bg: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)', accent: '#ffffff' },
        { title: 'Big Saving Days', subtitle: 'Get up to 40% OFF on all engine parts and brakes', cta: 'View Deals', bg: 'linear-gradient(135deg, #3b9eff 0%, #1e40af 100%)', accent: '#ffffff' },
    ];


    const bannersCount = banners.length;

    useEffect(() => {
        const timer = setInterval(() => setCurrentBanner(p => (p + 1) % bannersCount), 4000);
        return () => clearInterval(timer);
    }, [bannersCount]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        if (user.role === 'customer') navigate(`/customer/products${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`);
        else if (user.role === 'owner') navigate('/owner/products');
        else navigate('/admin/products');
    };

    const getDashboardRoute = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin/dashboard';
        if (user.role === 'owner') return '/owner/dashboard';
        return '/customer/products';

    };

    const getProductsRoute = (categoryParam) => {
        if (!user) return '/login';
        if (user.role === 'customer') return `/customer/products${categoryParam ? `?category=${encodeURIComponent(categoryParam)}` : ''}`;
        if (user.role === 'owner') return '/owner/products';
        return '/admin/products';
    };

    const getBookRoute = () => {
        if (!user) return '/login';
        if (user.role === 'customer') return '/customer/book';
        if (user.role === 'owner') return '/owner/bookings';
        return '/admin/bookings';
    };

    const getEnquiryRoute = () => {
        if (!user) return '/login';
        if (user.role === 'customer') return '/customer/enquiry';
        if (user.role === 'owner') return '/owner/enquiries';
        return '/admin/enquiries';
    };

    const goToCategory = (cat) => navigate(getProductsRoute(cat.route));

    const goToService = (svc) => {
        if (!user) return navigate('/login');
        if (svc.to === '/customer/book') navigate(getBookRoute());
        else if (svc.to === '/customer/enquiry') navigate(getEnquiryRoute());
        else navigate(getProductsRoute());
    };

    const handleDashboard = () => {
        if (!user) return navigate('/login');
        if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'owner') navigate('/owner/dashboard');
        else navigate('/customer/products');

    };

    return (
        <div className="home-page">
            {/* ── Topbar ── */}
            <div className="home-topbar">
                <span>📞 Call Us On: <strong>+91 9339332933</strong></span>
                <span>🚚 Free Delivery on orders above ₹499</span>
                <span>⭐ India's Biggest Auto Parts Marketplace</span>
            </div>

            {/* ── Header ── */}
            <header className="home-header">
                <div className="header-inner">
                    <div className="home-logo">
                        <div className="logo-badge">🔧</div>
                        <div>
                            <span className="logo-name">Satyam</span>
                            <span className="logo-sub"> Motor Parts</span>
                            <div className="logo-tagline">Genuine Parts • Best Rates</div>
                        </div>
                    </div>

                    <form className="home-search" onSubmit={handleSearch}>
                        <span className="search-icon">🔍</span>
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search for car parts, accessories..."
                        />
                        <button type="submit" className="search-btn">Search</button>
                    </form>

                    <div className="header-actions">
                        {user ? (
                            <>
                                {user.role !== 'customer' && (
                                    <button className="hdr-btn hdr-btn-outline" onClick={handleDashboard}>
                                        📊 Dashboard
                                    </button>
                                )}

                                <div className="hdr-user">
                                    <div className="hdr-avatar">{user.name?.[0]?.toUpperCase()}</div>
                                    <span>{user.name?.split(' ')[0]}</span>
                                </div>
                                <button className="hdr-btn hdr-btn-logout" onClick={handleLogout}>
                                    🚪 Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hdr-btn hdr-btn-outline">Login</Link>
                                <Link to="/register" className="hdr-btn hdr-btn-primary">Register</Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Nav */}
                <nav className="home-nav">
                    <div className="nav-inner">
                        {['All Categories', 'Car Care', 'Engine Parts', 'Body Parts', 'Brakes', 'Accessories', 'Offers', 'Brands'].map(item => (
                            <button key={item} className="nav-link" onClick={() => goToCategory({ route: item === 'All Categories' ? null : item })}>{item}</button>
                        ))}
                    </div>
                </nav>
            </header>

            {/* ── Hero Banner ── */}
            <section className="hero-section">
                <div className="hero-banner" style={{ background: banners[currentBanner].bg }}>
                    <div className="hero-content">
                        <div className="hero-badge" style={{ color: banners[currentBanner].accent }}>
                            ⚡ Limited Time Offer
                        </div>
                        <h1 className="hero-title">{banners[currentBanner].title}</h1>
                        <p className="hero-subtitle">{banners[currentBanner].subtitle}</p>
                        <div className="hero-actions">
                            <button className="hero-cta" style={{ background: banners[currentBanner].accent }} onClick={() => navigate(getProductsRoute())}>
                                {banners[currentBanner].cta} →
                            </button>
                            <button className="hero-cta-outline" onClick={() => navigate(getBookRoute())}>
                                Book Service
                            </button>
                        </div>
                        <div className="hero-stats">
                            <div className="h-stat"><strong>50,000+</strong><span>Products</span></div>
                            <div className="h-stat-div" />
                            <div className="h-stat"><strong>1,000+</strong><span>Brands</span></div>
                            <div className="h-stat-div" />
                            <div className="h-stat"><strong>48hr</strong><span>Delivery</span></div>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-circle" style={{ borderColor: banners[currentBanner].accent + '40' }}>
                            <div className="hero-emoji">🚗</div>
                            <div className="hero-orbit" style={{ borderColor: banners[currentBanner].accent + '30' }}>
                                <div className="hero-orbit-dot" style={{ background: banners[currentBanner].accent }} />
                            </div>
                        </div>
                    </div>
                    {/* Banner dots */}
                    <div className="banner-dots">
                        {banners.map((_, i) => (
                            <button key={i} className={`banner-dot ${i === currentBanner ? 'active' : ''}`} onClick={() => setCurrentBanner(i)} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Shop By Categories ── */}
            <section className="section">
                <div className="section-inner">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Shop By Categories</h2>
                            <p className="section-sub">Browse our wide range of genuine auto parts</p>
                        </div>
                        <button className="view-all-link" onClick={() => user ? navigate('/customer/products') : navigate('/login')}>View All →</button>
                    </div>
                    <div className="categories-grid">
                        {categories.map(cat => (
                            <div key={cat.id} className="category-card" onClick={() => goToCategory(cat)}>
                                <div className="cat-icon-wrap" style={{ background: cat.color + '20', border: `2px solid ${cat.color}30` }}>
                                    <span className="cat-icon">{cat.icon}</span>
                                </div>
                                <span className="cat-name">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Products ── */}
            <section className="section section-alt">
                <div className="section-inner">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Featured Products</h2>
                            <p className="section-sub">Top deals handpicked just for you</p>
                        </div>
                        <button className="view-all-link" onClick={() => user ? navigate('/customer/products') : navigate('/login')}>View All →</button>
                    </div>
                    <div className="products-grid">
                        {featuredProducts.map(p => (
                            <div key={p.id} className="fp-card" onClick={() => navigate(getProductsRoute(null))}>
                                {p.discount && <div className="fp-discount">{p.discount}% off</div>}
                                {!p.discount && <div className="fp-offer-tag">{p.tag}</div>}
                                <div className="fp-img">
                                    <span className="fp-emoji">{p.emoji}</span>
                                </div>
                                <div className="fp-body">
                                    <p className="fp-name">{p.name}</p>
                                    <div className="fp-price-row">
                                        <span className="fp-price">₹{p.price.toLocaleString()}</span>
                                        {p.mrp && <span className="fp-mrp">MRP ₹{p.mrp.toLocaleString()}</span>}
                                    </div>
                                    <button className="fp-add-btn">Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Promo Banner ── */}
            <section className="promo-strip-section">
                <div className="section-inner">
                    <div className="promo-strip">
                        <div className="promo-item">🎁 <span>Use code <strong>SAVE10</strong> for 10% off on your first order</span></div>
                        <div className="promo-item">🚚 <span><strong>Free Shipping</strong> on orders above ₹499</span></div>
                        <div className="promo-item">🔄 <span><strong>Easy Returns</strong> within 7 days</span></div>
                        <div className="promo-item">🔒 <span><strong>Secure Payments</strong> via all major methods</span></div>
                    </div>
                </div>
            </section>

            {/* ── Our Services ── */}
            <section className="section">
                <div className="section-inner">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Our Services</h2>
                            <p className="section-sub">Everything you need for your vehicle, at one place</p>
                        </div>
                    </div>
                    <div className="services-grid">
                        {services.map(s => (
                            <div key={s.name} className="service-card" onClick={() => goToService(s)}>
                                <div className="svc-icon-wrap" style={{ background: s.color + '15', border: `2px solid ${s.color}25` }}>
                                    <span className="svc-icon">{s.icon}</span>
                                </div>
                                <span className="svc-name">{s.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── OEM + OES Brands ── */}
            <section className="section section-alt">
                <div className="section-inner brands-section">
                    <div className="brands-col">
                        <h2 className="section-title" style={{ marginBottom: 6 }}>Popular OEM Brands</h2>
                        <p className="section-sub" style={{ marginBottom: 20 }}>Original equipment manufacturers</p>
                        <div className="brands-row">
                            {oemBrands.map(b => (
                                <div key={b} className="brand-chip oem">{b}</div>
                            ))}
                        </div>
                    </div>
                    <div className="brands-divider" />
                    <div className="brands-col">
                        <h2 className="section-title" style={{ marginBottom: 6 }}>Popular OES Brands</h2>
                        <p className="section-sub" style={{ marginBottom: 20 }}>Original equipment suppliers</p>
                        <div className="brands-row">
                            {oesBrands.map(b => (
                                <div key={b} className="brand-chip oes">{b}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Why Choose Us ── */}
            <section className="section why-section">
                <div className="section-inner">
                    <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
                        <h2 className="section-title">Why Choose Us</h2>
                        <p className="section-sub">Trusted by thousands of car owners across India</p>
                    </div>
                    <div className="why-grid">
                        {whyChooseUs.map(w => (
                            <div key={w.num} className="why-card">
                                <div className="why-icon">{w.icon}</div>
                                <div className="why-num">{w.num}</div>
                                <h3 className="why-title">{w.title}</h3>
                                <p className="why-desc">{w.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── App Download Banner ── */}
            <section className="app-banner-section">
                <div className="section-inner">
                    <div className="app-banner">
                        <div className="app-banner-left">
                            <h2 className="app-title">Download Satyam Motor Parts App</h2>
                            <p className="app-sub">Choose and book a seamless car service experience and also get exciting offers with our app</p>
                            <div className="app-badges">
                                <div className="store-badge">
                                    <span>▶</span>
                                    <div>
                                        <small>Get it on</small>
                                        <strong>Google Play</strong>
                                    </div>
                                </div>
                                <div className="store-badge">
                                    <span></span>
                                    <div>
                                        <small>Download on</small>
                                        <strong>App Store</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="app-banner-right">
                            <div className="phone-mockup">
                                <div className="phone-screen">
                                    <div className="phone-header">🔧 Satyam Motor</div>
                                    <div className="phone-content">
                                        <div className="phone-item">🛞 Tyre Shine — ₹675</div>
                                        <div className="phone-item">🛢️ Engine Oil — ₹459</div>
                                        <div className="phone-item active-item">✨ Dressing Compound — ₹900</div>
                                    </div>
                                    <div className="phone-btn">Book Service →</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Become a Seller ── */}
            {!user && (
                <section className="section section-alt seller-section">
                    <div className="section-inner">
                        <div className="seller-banner">
                            <div className="seller-left">
                                <div className="seller-badge">🏪 Partner with Us</div>
                                <h2 className="seller-title">Become a Seller at Satyam Motor Parts</h2>
                                <p className="seller-sub">Join our growing marketplace and reach thousands of customers. Start your selling journey today!</p>
                                <div className="seller-perks">
                                    <div className="seller-perk">✅ Earn more with competitive incentives</div>
                                    <div className="seller-perk">✅ Reach thousands of customers</div>
                                    <div className="seller-perk">✅ Easy to start selling</div>
                                </div>
                                <Link to="/register" className="seller-cta">Start Selling Today →</Link>
                            </div>
                            <div className="seller-stats">
                                <div className="s-stat">
                                    <strong>1000+</strong>
                                    <span>Active Sellers</span>
                                </div>
                                <div className="s-stat">
                                    <strong>50K+</strong>
                                    <span>Products Listed</span>
                                </div>
                                <div className="s-stat">
                                    <strong>₹50L+</strong>
                                    <span>Monthly Sales</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Footer ── */}
            <footer className="home-footer">
                <div className="footer-inner">
                    <div className="footer-col footer-brand">
                        <div className="footer-logo">🔧 Satyam Motor Parts</div>
                        <p>India's trusted marketplace for genuine auto parts. Quality products, best prices, fastest delivery.</p>
                        <div className="footer-contact">📞 +91 9339332933</div>
                        <div className="footer-socials">
                            <button className="footer-social-btn">📘</button><button className="footer-social-btn">📸</button><button className="footer-social-btn">🐦</button><button className="footer-social-btn">▶</button>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>About</h4>
                        <button className="footer-link-btn">About us</button>
                        <button className="footer-link-btn">Contact us</button>
                        <button className="footer-link-btn">Blogs</button>
                        <button className="footer-link-btn">FAQ</button>
                    </div>

                    <div className="footer-col">
                        <h4>Policy</h4>
                        <button className="footer-link-btn">Return Policy</button>
                        <button className="footer-link-btn">Privacy Policy</button>
                        <button className="footer-link-btn">Disclaimer</button>
                        <button className="footer-link-btn">Terms of Use</button>
                    </div>

                    <div className="footer-col">
                        <h4>Useful Links</h4>
                        <button className="footer-link-btn" onClick={() => navigate(getProductsRoute())}>Shop</button>
                        <button className="footer-link-btn">OEM Brands</button>
                        <button className="footer-link-btn">OES Brands</button>
                        <button className="footer-link-btn" onClick={() => navigate('/register')}>Register</button>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2024 Satyam Motor Parts. All rights reserved.</span>
                    <span>Made with ❤️ in India</span>
                </div>
            </footer>
        </div>
    );
};

export default Home;
