import React, { useEffect, useState } from 'react';
import CustomerLayout from '../../components/CustomerLayout';
import api from '../../services/api';
import './Customer.css';

const Enquiry = () => {
    const [form, setForm] = useState({ subject: '', category: '', message: '' });
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchEnquiries = async () => {
        try {
            const { data } = await api.get('/enquiries/my');
            setEnquiries(data);
        } catch (err) {
            console.error(err);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => { fetchEnquiries(); }, []);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError(''); setSuccessMsg(''); setLoading(true);
        try {
            await api.post('/enquiries', form);
            setSuccessMsg('✅ Enquiry submitted successfully!');
            setForm({ subject: '', category: '', message: '' });
            fetchEnquiries();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit enquiry.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomerLayout>
            <div className="eq-layout">
                {/* ── Left: Submit Form ── */}
                <div className="eq-card">
                    <div className="eq-card-title">💬 Submit an Enquiry</div>

                    {error && <div className="cb-alert error" style={{ marginBottom: 14 }}>{error}</div>}
                    {successMsg && <div className="cb-alert success" style={{ marginBottom: 14 }}>{successMsg}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="eq-field">
                            <label className="eq-label">Category *</label>
                            <select className="eq-select" name="category" value={form.category} onChange={handleChange} required>
                                <option value="">Select category</option>
                                <option>Product Enquiry</option>
                                <option>Service Enquiry</option>
                                <option>Pricing</option>
                                <option>Delivery</option>
                                <option>Warranty</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="eq-field">
                            <label className="eq-label">Subject *</label>
                            <input
                                className="eq-input"
                                name="subject"
                                placeholder="What is your enquiry about?"
                                value={form.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="eq-field">
                            <label className="eq-label">Message *</label>
                            <textarea
                                className="eq-textarea"
                                name="message"
                                placeholder="Please describe your enquiry in detail..."
                                value={form.message}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button className="eq-submit" type="submit" disabled={loading}>
                            {loading ? '⏳ Submitting...' : '📨 Submit Enquiry'}
                        </button>
                    </form>
                </div>

                {/* ── Right: Past Enquiries ── */}
                <div className="eq-card">
                    <div className="eq-card-title">📜 My Enquiries ({enquiries.length})</div>

                    {fetchLoading ? (
                        <div className="cp-loading"><div className="cp-spinner" /></div>
                    ) : enquiries.length === 0 ? (
                        <div className="eq-empty">
                            <div className="eq-empty-icon">💬</div>
                            <p>No enquiries submitted yet</p>
                        </div>
                    ) : (
                        <div className="eq-list">
                            {enquiries.map(eq => (
                                <div key={eq._id} className="eq-item">
                                    <div className="eq-item-subject">{eq.subject}</div>
                                    <div className="eq-item-msg">{eq.message}</div>

                                    {eq.reply && (
                                        <div className="eq-item-reply">
                                            <div className="eq-reply-header">
                                                <span className="eq-reply-icon">↪️</span>
                                                <strong>Owner's Response:</strong>
                                            </div>
                                            <div className="eq-reply-content">{eq.reply}</div>
                                        </div>
                                    )}

                                    <div className="eq-item-footer">
                                        <span>{new Date(eq.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}</span>
                                        <span className={`eq-status ${eq.status || 'pending'}`}>
                                            {eq.status || 'pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Enquiry;
