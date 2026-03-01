import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FiArrowLeft } from 'react-icons/fi';
import '../pages/owner/Owner.css';

const OwnerLayout = ({ children, title, subtitle, actions, backTo }) => {
    const navigate = useNavigate();

    return (
        <div className="ol-layout">
            <Sidebar />
            <main className="ol-main">
                <div className="ol-header">
                    <div className="ol-branding" style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'var(--hp-primary)', color: 'white', padding: '5px', borderRadius: '5px', fontSize: '16px' }}>🔧</div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '14px', fontWeight: '800', color: '#1a1a2e', lineHeight: '1' }}>Satyam Motor Parts</div>
                            <div style={{ fontSize: '10px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bikramganj, Bihar</div>
                            <div style={{ fontSize: '9px', color: '#ff6b35', fontWeight: 'bold' }}>Genuine Parts • Best Rates</div>
                        </div>
                    </div>
                    <div className="ol-title-group">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {backTo && (
                                <button
                                    className="ol-back-btn"
                                    onClick={() => navigate(backTo)}
                                    title="Back"
                                >
                                    <FiArrowLeft />
                                </button>
                            )}
                            <h1>{title}</h1>
                        </div>
                        {subtitle && <p>{subtitle}</p>}
                    </div>
                    {actions && <div className="ol-header-actions">{actions}</div>}
                </div>
                <div className="ol-body">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default OwnerLayout;

