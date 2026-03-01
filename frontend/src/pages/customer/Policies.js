import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Customer.css';

const Policies = () => {
    const { type } = useParams();
    const navigate = useNavigate();

    const policyContent = {
        'return-policy': {
            title: 'Return Policy',
            content: (
                <div className="policy-box no-return">
                    <h2>⚠️ No Return Policy</h2>
                    <p>At Satyam Motor Parts, we strive to provide high-quality genuine spare parts. Please note that we strictly follow a <strong>No Return and No Exchange Policy</strong> once the product is sold and delivered.</p>
                    <ul>
                        <li>We request customers to verify compatibility before ordering.</li>
                        <li>In case of manufacturing defects (proven), please contact us within 24 hours of delivery.</li>
                        <li>Items sold under "Offers" or "Clearance" are not eligible for any claims.</li>
                    </ul>
                </div>
            )
        },
        'privacy-policy': {
            title: 'Privacy Policy',
            content: (
                <div className="policy-box">
                    <h2>🔒 Privacy Policy</h2>
                    <p>Your privacy is important to us. This policy explains how we collect and use your data.</p>
                    <ul>
                        <li>We collect name, contact, and address for order processing only.</li>
                        <li>Your payment details are processed through secure gateways and never stored on our servers.</li>
                        <li>We do not share your personal information with third parties for marketing purposes.</li>
                    </ul>
                </div>
            )
        },
        'disclaimer': {
            title: 'Disclaimer',
            content: (
                <div className="policy-box">
                    <h2>⚖️ Disclaimer</h2>
                    <p>The information and products provided on this website are for general automotive purposes only.</p>
                    <ul>
                        <li>Satyam Motor Parts is not liable for any mechanical failures or accidents resulting from incorrect part selection or installation.</li>
                        <li>We recommend professional installation for all mechanical and electrical parts.</li>
                        <li>Prices and availability are subject to change without notice.</li>
                    </ul>
                </div>
            )
        },
        'terms': {
            title: 'Terms of Use',
            content: (
                <div className="policy-box">
                    <h2>📝 Terms of Use</h2>
                    <p>By using Satyam Motor Parts website, you agree to the following terms:</p>
                    <ul>
                        <li>Users must provide accurate information during registration and checkout.</li>
                        <li>Any attempt to misuse the website or fraudulent activities will lead to immediate account termination.</li>
                        <li>All content on this site (titles, descriptions, images) is property of Satyam Motor Parts.</li>
                    </ul>
                </div>
            )
        }
    };

    const current = policyContent[type] || policyContent['terms'];

    return (
        <div className="policy-page">
            <div className="policy-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                <h1>{current.title}</h1>
            </div>
            <div className="policy-container">
                {current.content}
            </div>
            <div className="policy-footer">
                <p>© 2026 Satyam Motor Parts. All rights reserved.</p>
                <p style={{ fontSize: '11px', marginTop: '4px' }}>Built & Managed by Satyam Kumar | Made with ❤️ in India</p>
            </div>
        </div>
    );
};

export default Policies;
