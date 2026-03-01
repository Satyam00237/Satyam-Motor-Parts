import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
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
    { id: 1, name: 'TYRE SHINE (5 Ltr)', price: 1499, discountPercentage: 54, tag: 'Best Seller', emoji: '🛞' },
    { id: 2, name: 'Effortless One Step Rubbing Compound', price: 1299, discountPercentage: 49, tag: 'Top Rated', emoji: '🧴' },
    { id: 3, name: 'AutoDukan Coolant Blue', price: 259, discountPercentage: 57, tag: 'Hot Deal', emoji: '🧊' },
    { id: 4, name: 'MAK ALPHA ZENITH 5W30 - 1Lt', price: 670, discountPercentage: 0, tag: 'Online Offer', emoji: '🛢️' },
    { id: 5, name: 'MAK ALPHA ZENITH 5W30 - 3.5Lt', price: 2335, discountPercentage: 0, tag: 'Online Offer', emoji: '🛢️' },
    { id: 6, name: 'Engine Oil Premium', price: 459, discountPercentage: 0, tag: 'Online Offer', emoji: '⚙️' },
    { id: 7, name: 'MAK CLASSIC PLUS 5W30 - 3 Ltr', price: 1326, discountPercentage: 0, tag: 'Online Offer', emoji: '🛢️' },
    { id: 8, name: 'MULTI PURPOSE DRESSING (5 Ltr)', price: 1999, discountPercentage: 54, tag: 'Top Pick', emoji: '✨' },
];

const services = [
    { name: 'Towing', icon: '🚛', color: '#f59e0b', to: '/customer/enquiry', desc: 'Reliable 24/7 roadside assistance and towing for emergencies.' },
    { name: 'Garages', icon: '🏭', color: '#10b981', to: '/customer/book', desc: 'Find and book top-rated garages near you for all types of car repairs.' },
    { name: 'Fast Services', icon: '⚡', color: '#3b9eff', to: '/customer/book', desc: 'Quick vehicle maintenance and express care services on priority.' },
    { name: 'Online Seller', icon: '🛒', color: '#ef4444', to: '/customer/products', desc: 'Buy genuine spare parts and accessories from verified sellers.' },
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
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [currentBanner, setCurrentBanner] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const banners = [
        { title: 'Genuine Auto Parts', subtitle: 'Get the best quality spare parts delivered to your doorstep', cta: 'Shop Now', bg: 'linear-gradient(135deg, #1a1a2e 0%, #24244a 100%)', accent: '#ff6b35' },
        { title: 'Premium Car Care', subtitle: 'Professional grade products for your vehicle maintenance', cta: 'Explore', bg: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)', accent: '#1a1a2e' },
        { title: 'Big Saving Days', subtitle: 'Get up to 40% OFF on all engine parts and brakes', cta: 'View Deals', bg: 'linear-gradient(135deg, #3b9eff 0%, #1e40af 100%)', accent: '#ff6b35' },
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
                <span>📞 Call Us On: <strong>+91-7257008160</strong></span>
                <span>🚚 Free Delivery on orders above ₹499</span>
                <span>⭐ India's Biggest Auto Parts Marketplace</span>
            </div>

            {/* ── Header ── */}
            <header className="home-header">
                <div className="header-inner">
                    <div className="home-logo">
                        <div className="logo-badge">🔧</div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                            <div>
                                <span className="logo-name">Satyam</span>
                                <span className="logo-sub"> Motor Parts</span>
                            </div>
                            <div className="logo-location" style={{ fontSize: '11px', fontWeight: '600', color: '#888', marginTop: '1px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bikramganj, Bihar</div>
                            <div className="logo-tagline" style={{ marginTop: '1px' }}>Genuine Parts • Best Rates</div>
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
                            <div className="cl-user-dropdown-wrap">
                                <div className="cl-user-chip">
                                    <div className="cl-avatar">{user.name?.[0]?.toUpperCase()}</div>
                                    <span>{user.name?.split(' ')[0]}</span>
                                    <div className="cl-dropdown-arrow">▼</div>
                                </div>
                                <div className="cl-user-dropdown">
                                    <div className="cl-dropdown-header">
                                        <strong>{user.name}</strong>
                                        <span>{user.email}</span>
                                    </div>
                                    {user.role !== 'customer' && (
                                        <button onClick={handleDashboard}>📊 Dashboard</button>
                                    )}
                                    <button onClick={() => navigate('/customer/profile')}>👤 My Profile</button>
                                    <button onClick={() => navigate('/customer/history')}>📋 My Activity</button>
                                    <button onClick={() => navigate('/customer/enquiry')}>💬 My Enquiries</button>
                                    <div className="cl-dropdown-divider"></div>
                                    <button className="cl-logout-btn" onClick={handleLogout}>🚪 Logout</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="hdr-btn hdr-btn-outline">Login</Link>
                                <Link to="/register" className="hdr-btn hdr-btn-primary">Register</Link>
                            </>
                        )}

                        <div className="cl-cart-link" onClick={() => navigate(user ? '/customer/cart' : '/login')}>
                            <div className="cl-cart-icon">🛒</div>
                            {cartCount > 0 && <span className="cl-cart-badge">{cartCount}</span>}
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="home-nav">
                    <div className="nav-inner">
                        {['All Categories', 'Car Care', 'Engine Parts', 'Body Parts', 'Brakes', 'Accessories', 'Offers', 'Brands'].map(item => (
                            <button key={item} className="nav-link" onClick={() => goToCategory({ route: item === 'All Categories' ? null : item })}>{item}</button>
                        ))}
                        <button className="nav-link" onClick={() => navigate(getBookRoute())}>Book Service</button>
                        <button className="nav-link" onClick={() => navigate(getEnquiryRoute())}>Enquiry</button>
                    </div>
                </nav>
            </header>

            {/* ── Hero Banner ── */}
            <section className="hero-section">
                <div className="hero-banner" style={{ background: banners[currentBanner].bg }}>
                    <div className="banner-mesh" />

                    {/* Floating Decorative Parts */}
                    <div className="hero-floating-parts">
                        <div className="f-part fp-1">🔧</div>
                        <div className="f-part fp-2">⚙️</div>
                        <div className="f-part fp-3">🔩</div>
                        <div className="f-part fp-4">🚗</div>
                        <div className="f-part fp-5">⚡</div>
                    </div>

                    <div className="hero-content">
                        <div className="hero-badge-group">
                            <div className="hero-badge animate-pop" style={{ background: banners[currentBanner].accent + '25', color: banners[currentBanner].accent, border: `1px solid ${banners[currentBanner].accent}40` }}>
                                ⚡ Special Member Deals
                            </div>
                            <div className="hero-trust-badge">
                                ⭐ 4.9/5 Rating by 10k+ Customers
                            </div>
                        </div>

                        <h1 className="hero-title">
                            {banners[currentBanner].title.split(' ').map((word, i) => (
                                <span key={i} className="title-word">{word} </span>
                            ))}
                        </h1>
                        <p className="hero-subtitle">{banners[currentBanner].subtitle}</p>

                        <div className="hero-actions">
                            <button className="hero-cta shimmer-effect" style={{ background: banners[currentBanner].accent }} onClick={() => navigate(getProductsRoute())}>
                                {banners[currentBanner].cta} →
                            </button>
                            <button className="hero-cta-outline glass-effect" onClick={() => navigate(getBookRoute())}>
                                Book Service
                            </button>
                        </div>

                        <div className="hero-perks">
                            <div className="h-perk">✔️ Genuine Parts</div>
                            <div className="h-perk">✔️ Fast Delivery</div>
                            <div className="h-perk">✔️ Best Support</div>
                        </div>
                    </div>

                    <div className="hero-visual-v2">
                        <div className="speed-track">
                            <div className="speed-line sl-1" />
                            <div className="speed-line sl-2" />
                            <div className="speed-line sl-3" />

                            {/* Decorative modern dots */}
                            <div className="h-dot hd-1" />
                            <div className="h-dot hd-2" />
                            <div className="h-dot hd-3" />
                        </div>
                        <div className="hero-car-wrap">
                            <div className="hero-car-glow" style={{ background: banners[currentBanner].accent }} />
                            <div className="modern-car-body sedan">
                                <svg viewBox="0 0 512 512" className="modern-car-svg">
                                    {/* BMW Style Sedan Profile (Black Body) */}
                                    <path fill="currentColor" d="M496 384H16c-8.8 0-16-7.2-16-16v-40c0-22.1 17.9-40 40-40h20c15-45 45-90 100-90h160c55 0 85 45 100 90h52c22.1 0 40 17.9 40 40v40c0 8.8-7.2 16-16 16z" />

                                    {/* Windows - Better Visibility on Black */}
                                    <path fill="rgba(255,255,255,0.2)" d="M125 255h85v-50c-35 0-65 25-85 50zm105 0h90v-50h-90v50zm110 0h85c-20-25-50-50-85-50v50z" />

                                    {/* Detail Lines (Lighter for Black contrast) */}
                                    <path fill="rgba(255,255,255,0.08)" d="M50 340h412v6H50z" />

                                    {/* Headlight detail */}
                                    <path fill="rgba(255,255,255,0.1)" d="M460 300h40v20h-40zM12 300h40v20H12z" />

                                    {/* Wheels */}
                                    <circle fill="#000" cx="110" cy="384" r="45" />
                                    <circle fill="#000" cx="402" cy="384" r="45" />
                                    <circle fill="#333" cx="110" cy="384" r="30" />
                                    <circle fill="#333" cx="402" cy="384" r="30" />
                                    <circle fill="#666" cx="110" cy="384" r="10" />
                                    <circle fill="#666" cx="402" cy="384" r="10" />
                                </svg>
                                <div className="car-headlight sedan-light" />
                                <div className="car-headlight sedan-light ch-left" />
                            </div>
                            <div className="hero-car-trail" />
                        </div>
                        <div className="parallax-blobs">
                            <div className="p-blob pb-1" style={{ background: banners[currentBanner].accent }} />
                            <div className="p-blob pb-2" />
                        </div>
                    </div>

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
                                {p.discountPercentage > 0 && <div className="fp-discount">{p.discountPercentage}% off</div>}
                                {p.discountPercentage <= 0 && <div className="fp-offer-tag">{p.tag}</div>}
                                <div className="fp-img">
                                    <span className="fp-emoji">{p.emoji}</span>
                                </div>
                                <div className="fp-body">
                                    <p className="fp-name">{p.name}</p>
                                    <div className="fp-price-row">
                                        {p.discountPercentage > 0 ? (
                                            <>
                                                <span className="fp-price">₹{(p.price * (1 - p.discountPercentage / 100)).toLocaleString()}</span>
                                                <span className="fp-mrp" style={{ textDecoration: 'line-through' }}>₹{p.price.toLocaleString()}</span>
                                            </>
                                        ) : (
                                            <span className="fp-price">₹{p.price.toLocaleString()}</span>
                                        )}
                                    </div>
                                    <button className="fp-add-btn">Add to Cart</button>
                                </div>
                            </div>
                        ))}
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
                    <div className="why-grid">
                        {services.map(s => (
                            <div key={s.name} className="why-card" onClick={() => goToService(s)} style={{ cursor: 'pointer' }}>
                                <div className="why-icon">{s.icon}</div>
                                <h3 className="why-title">{s.name}</h3>
                                <p className="why-desc" style={{ fontSize: '12px' }}>{s.desc}</p>
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
                        <div className="footer-contact">📞 +91-7257008160</div>
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
                        <button className="footer-link-btn" onClick={() => navigate('/policy/return-policy')}>Return Policy</button>
                        <button className="footer-link-btn" onClick={() => navigate('/policy/privacy-policy')}>Privacy Policy</button>
                        <button className="footer-link-btn" onClick={() => navigate('/policy/disclaimer')}>Disclaimer</button>
                        <button className="footer-link-btn" onClick={() => navigate('/policy/terms')}>Terms of Use</button>
                    </div>

                    <div className="footer-col">
                        <h4>Useful Links</h4>
                        <button className="footer-link-btn" onClick={() => navigate(getProductsRoute())}>Shop</button>
                        <button className="footer-link-btn">OEM Brands</button>
                        <button className="footer-link-btn">OES Brands</button>
                        <button className="footer-link-btn" onClick={() => navigate('/register')}>Register</button>
                    </div>
                </div>
                <div className="footer-bottom" style={{ flexDirection: 'column', gap: '5px' }}>
                    <span>© 2026 Satyam Motor Parts. All rights reserved.</span>
                    <span style={{ fontSize: '12px', opacity: 0.8 }}>Built & Managed by Satyam Kumar</span>
                    <span>Made with ❤️ in India</span>
                </div>
            </footer>
        </div>
    );
};

export default Home;
