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

