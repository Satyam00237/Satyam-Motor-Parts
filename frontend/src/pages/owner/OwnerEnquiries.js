import React, { useEffect, useState } from 'react';
import OwnerLayout from '../../components/OwnerLayout';
import api from '../../services/api';
import { FiMessageSquare, FiX, FiCornerUpRight } from 'react-icons/fi';

const OwnerEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [reply, setReply] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get('/enquiries').then(r => setEnquiries(r.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleReply = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.patch(`/enquiries/${selected._id}`, { reply, status: 'replied' });
            setEnquiries(enquiries.map(enq => enq._id === selected._id ? data : enq));
            setSelected(null);
            setReply('');
        } catch (err) { alert('Failed to send reply'); }
        finally { setSaving(false); }
    };

    const handleClose = async (id) => {
        try {
            const { data } = await api.patch(`/enquiries/${id}`, { status: 'closed' });
            setEnquiries(enquiries.map(enq => enq._id === id ? data : enq));
        } catch (err) { alert('Failed to close enquiry'); }
    };

    return (
        <OwnerLayout
            title="💬 Customer Enquiries"
            subtitle="View and respond to customer questions and feedback"
            backTo="/owner/dashboard"
        >
            <div className="ol-card" style={{ padding: 0 }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}>
                        <div className="spinner" style={{ margin: '0 auto' }} />
                    </div>
                ) : enquiries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <FiMessageSquare size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                        <h3>No enquiries yet</h3>
                    </div>
                ) : (
                    <div className="ol-table-wrap">
                        <table className="ol-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Type</th>
                                    <th>Subject & Message</th>
                                    <th>Status</th>
                                    <th>Response</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enquiries.map(e => (
                                    <tr key={e._id}>
                                        <td>
                                            <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{e.customer?.name}</div>
                                            <div style={{ fontSize: 11, color: '#888' }}>{e.customer?.email}</div>
                                        </td>
                                        <td>
                                            <span className="ol-badge" style={{ background: '#f0f0ff', color: '#5c5cff' }}>{e.type}</span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>{e.subject}</div>
                                            <div style={{ color: '#666', fontSize: 12, lineHeight: 1.4, maxWidth: 280 }}>
                                                {e.message.slice(0, 100)}{e.message.length > 100 ? '...' : ''}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`ol-badge ol-status-${e.status || 'pending'}`}>
                                                {e.status}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 12, color: '#555', maxWidth: 160, fontStyle: e.reply ? 'normal' : 'italic' }}>
                                            {e.reply || 'No reply yet'}
                                        </td>
                                        <td style={{ fontSize: 12, color: '#888' }}>
                                            {new Date(e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                {e.status !== 'closed' && (
                                                    <>
                                                        <button
                                                            className="ol-btn ol-btn-sm"
                                                            style={{ background: '#1a1a2e', color: '#fff' }}
                                                            onClick={() => { setSelected(e); setReply(e.reply || ''); }}
                                                        >
                                                            Reply
                                                        </button>
                                                        <button
                                                            className="ol-btn ol-btn-sm"
                                                            style={{ background: '#fff', color: '#666', border: '1px solid #ddd' }}
                                                            onClick={() => handleClose(e._id)}
                                                        >
                                                            Close
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selected && (
                <div className="ol-modal-overlay" onClick={() => setSelected(null)}>
                    <div className="ol-modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
                        <div className="ol-modal-header">
                            <h2>Reply to Enquiry</h2>
                            <button onClick={() => setSelected(null)}><FiX /></button>
                        </div>
                        <div className="ol-modal-body">
                            <div style={{ marginBottom: 20, padding: 16, background: '#f8f9fa', borderRadius: 12, borderLeft: '4px solid #1a1a2e' }}>
                                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>From: {selected.customer?.name}</div>
                                <div style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 8, fontSize: 15 }}>{selected.subject}</div>
                                <div style={{ fontSize: 13, color: '#444', lineHeight: 1.5 }}>{selected.message}</div>
                            </div>

                            <form onSubmit={handleReply}>
                                <div className="ol-form-group">
                                    <label>Response Message</label>
                                    <textarea
                                        className="ol-input"
                                        style={{ minHeight: 140, padding: 12, resize: 'vertical' }}
                                        value={reply}
                                        onChange={e => setReply(e.target.value)}
                                        placeholder="Type your response here..."
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                                    <button type="button" className="ol-btn" style={{ background: '#fff', color: '#666', border: '1px solid #ddd' }} onClick={() => setSelected(null)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="ol-btn" style={{ background: '#1a1a2e', color: '#fff' }} disabled={saving}>
                                        <FiCornerUpRight style={{ marginRight: 6 }} />
                                        {saving ? 'Sending...' : 'Send Reply'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </OwnerLayout>
    );
};

export default OwnerEnquiries;

