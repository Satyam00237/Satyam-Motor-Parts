import React, { useEffect, useState } from 'react';
import CustomerLayout from '../../components/CustomerLayout';
import api from '../../services/api';
import './Customer.css';

const Enquiry = () => {
    const [form, setForm] = useState({ subject: '', type: 'general', message: '' });
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [replyContents, setReplyContents] = useState({});

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
            setForm({ subject: '', type: 'general', message: '' });
            fetchEnquiries();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit enquiry.');
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (id) => {
        const content = replyContents[id];
        if (!content || !content.trim()) return;
        setLoading(true);
        try {
            await api.post(`/enquiries/${id}/reply`, { content });
            setReplyContents({ ...replyContents, [id]: '' });
            fetchEnquiries();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reply.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomerLayout>
            <div className="eq-layout">
                {/* ── Left: Submit Form ── */}
                <div className="eq-card">
                    <div className="eq-card-title">💬 Submit a New Enquiry</div>

                    {error && <div className="cb-alert error" style={{ marginBottom: 14 }}>{error}</div>}
                    {successMsg && <div className="cb-alert success" style={{ marginBottom: 14 }}>{successMsg}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="eq-field">
                            <label className="eq-label">Category *</label>
                            <select className="eq-select" name="type" value={form.type} onChange={handleChange} required>
                                <option value="general">General Enquiry</option>
                                <option value="product">Product Enquiry</option>
                                <option value="service">Service Enquiry</option>
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
                    <div className="eq-card-title">📜 My Conversation History ({enquiries.length})</div>

                    {fetchLoading ? (
                        <div className="cp-loading"><div className="cp-spinner" /></div>
                    ) : enquiries.length === 0 ? (
                        <div className="eq-empty">
                            <div className="eq-empty-icon">💬</div>
                            <p>No enquiries submitted yet</p>
                        </div>
                    ) : (
                        <div className="eq-list">
                            {enquiries.filter(eq => eq.status !== 'closed').map(eq => (
                                <div key={eq._id} className="eq-item">
                                    <div className="eq-item-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <div className="eq-item-subject">{eq.subject}</div>
                                        <span className={`eq-status ${eq.status || 'open'}`}>
                                            {eq.status || 'open'}
                                        </span>
                                    </div>

                                    {/* Message Thread */}
                                    <div className="eq-thread" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                                        {(eq.messages && eq.messages.length > 0 ? eq.messages : [{ sender: eq.customer, content: eq.message, createdAt: eq.createdAt }]).map((msg, idx) => {
                                            const isMe = msg.sender?._id === eq.customer?._id || msg.sender === eq.customer?._id;
                                            return (
                                                <div key={idx} className={`msg-bubble ${isMe ? 'me' : 'other'}`} style={{
                                                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                                                    maxWidth: '85%',
                                                    padding: '8px 12px',
                                                    borderRadius: 12,
                                                    fontSize: '12.5px',
                                                    background: isMe ? '#fff4ef' : '#f0f0f0',
                                                    border: isMe ? '1px solid #ff6b35' : '1px solid #ddd',
                                                    position: 'relative'
                                                }}>
                                                    <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: 2, color: isMe ? '#ff6b35' : '#1a1a2e' }}>
                                                        {isMe ? 'You' : (msg.sender?.name || 'Owner')}
                                                    </div>
                                                    <div style={{ color: '#333' }}>{msg.content}</div>
                                                    <div style={{ fontSize: '9px', color: '#999', textAlign: 'right', marginTop: 4 }}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* WhatsApp Style Reply Box */}
                                    {eq.status !== 'closed' ? (
                                        <div className="whatsapp-reply" style={{
                                            display: 'flex',
                                            gap: 8,
                                            marginTop: 10,
                                            padding: '8px 12px',
                                            background: '#f0f0f0',
                                            borderRadius: '24px',
                                            alignItems: 'center'
                                        }}>
                                            <input
                                                type="text"
                                                placeholder="Type a message..."
                                                style={{
                                                    flex: 1,
                                                    border: 'none',
                                                    background: 'transparent',
                                                    padding: '8px 4px',
                                                    fontSize: '13px',
                                                    outline: 'none'
                                                }}
                                                value={replyContents[eq._id] || ''}
                                                onChange={(e) => setReplyContents({ ...replyContents, [eq._id]: e.target.value })}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') handleReply(eq._id);
                                                }}
                                            />
                                            <button
                                                onClick={() => handleReply(eq._id)}
                                                disabled={loading}
                                                style={{
                                                    background: '#ff6b35',
                                                    border: 'none',
                                                    color: 'white',
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                ➔
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '8px',
                                            background: '#f8f9fa',
                                            borderRadius: '8px',
                                            color: '#888',
                                            fontSize: '12px',
                                            marginTop: 10,
                                            border: '1px dashed #ddd'
                                        }}>
                                            🔒 This conversation is closed
                                        </div>
                                    )}
                                    <div style={{ fontSize: '10px', color: '#888', marginTop: 6, textAlign: 'right' }}>
                                        {new Date(eq.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
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
