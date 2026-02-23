import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiHome, FiPackage, FiCalendar, FiClock, FiMessageSquare,
    FiUsers, FiBarChart2, FiLogOut, FiMenu, FiX, FiShoppingCart
} from 'react-icons/fi';

const navConfig = {
    customer: [
        { to: '/customer/products', icon: <FiPackage />, label: 'Products' },
        { to: '/customer/book', icon: <FiCalendar />, label: 'Book Service' },
        { to: '/customer/history', icon: <FiClock />, label: 'My Bookings' },
        { to: '/customer/enquiry', icon: <FiMessageSquare />, label: 'Enquiries' },
    ],
    owner: [
        { to: '/owner/dashboard', icon: <FiHome />, label: 'Dashboard' },
        { to: '/owner/billing', icon: <FiShoppingCart />, label: 'Billing' },
        { to: '/owner/products', icon: <FiPackage />, label: 'Products' },
        { to: '/owner/orders', icon: <FiShoppingCart />, label: 'Orders' },
        { to: '/owner/bookings', icon: <FiCalendar />, label: 'Bookings' },
        { to: '/owner/enquiries', icon: <FiMessageSquare />, label: 'Enquiries' },
    ],
    admin: [
        { to: '/admin/dashboard', icon: <FiBarChart2 />, label: 'Dashboard' },
        { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
        { to: '/admin/products', icon: <FiPackage />, label: 'Products' },
        { to: '/admin/orders', icon: <FiShoppingCart />, label: 'Orders' },
        { to: '/admin/bookings', icon: <FiCalendar />, label: 'Bookings' },
        { to: '/admin/enquiries', icon: <FiMessageSquare />, label: 'Enquiries' },
    ],
};


const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const navItems = navConfig[user?.role] || [];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // const roleColors = { customer: '#3b82f6', owner: '#f97316', admin: '#10b981' };
    // const roleColor = roleColors[user?.role] || '#f97316';

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    display: 'none', position: 'fixed', top: 16, left: 16, zIndex: 1100,
                    background: '#1a1a2e', border: 'none',
                    color: '#fff', borderRadius: '8px', padding: '10px',
                    cursor: 'pointer', fontSize: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                className="sidebar-toggle"
            >
                {open ? <FiX /> : <FiMenu />}
            </button>

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.5)',
                        zIndex: 999, display: 'none', backdropFilter: 'blur(4px)'
                    }}
                    className="sidebar-overlay"
                />
            )}

            <aside style={{
                width: 260,
                background: '#1a1a2e',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0, left: 0, bottom: 0,
                zIndex: 1000,
                transition: 'transform 0.3s',
                fontFamily: "'Poppins', sans-serif"
            }}>
                {/* Logo */}
                <div style={{
                    padding: '24px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 42, height: 42,
                            background: 'linear-gradient(135deg, #ff6b35, #ff9f1c)',
                            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 20,
                        }}>
                            ⚙️
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.2px' }}>Satyam Motor Parts</div>
                            <div style={{ fontSize: 10, color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Parts & Service</div>
                        </div>
                    </div>
                </div>

                {/* User info */}
                <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', gap: 12,
                }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700, color: '#ff6b35',
                    }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.name}
                        </div>
                        <div style={{
                            fontSize: 10, fontWeight: 600, color: '#ff6b35',
                            textTransform: 'uppercase', letterSpacing: '0.06em'
                        }}>
                            {user?.role} Portal
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '20px 14px', overflowY: 'auto' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px 10px' }}>
                        Menu
                    </div>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setOpen(false)}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: 14,
                                padding: '12px 16px',
                                borderRadius: 10,
                                marginBottom: 4,
                                fontSize: 14,
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                                background: isActive ? 'linear-gradient(90deg, #ff6b35 0%, rgba(255,107,53,0.1) 100%)' : 'transparent',
                                transition: 'all 0.2s ease',
                                textDecoration: 'none',
                                boxShadow: isActive ? '0 4px 12px rgba(255,107,53,0.2)' : 'none'
                            })}
                        >
                            <span style={{ fontSize: 18 }}>{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div style={{ padding: '20px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            width: '100%', padding: '12px 16px',
                            borderRadius: 10, background: 'rgba(220,38,38,0.05)',
                            border: '1px solid rgba(220,38,38,0.1)',
                            color: '#ef4444', cursor: 'pointer', fontSize: 14,
                            fontFamily: "'Poppins', sans-serif", fontWeight: 600,
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(220,38,38,0.1)';
                            e.currentTarget.style.borderColor = 'rgba(220,38,38,0.2)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(220,38,38,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(220,38,38,0.1)';
                        }}
                    >
                        <FiLogOut style={{ fontSize: 18 }} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );

};

export default Sidebar;
