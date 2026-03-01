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
            const { data } = await api.post(`/enquiries/${selected._id}/reply`, { content: reply });
            setEnquiries(enquiries.map(enq => enq._id === selected._id ? data : enq));
            setSelected(data); // Keep modal open with updated data
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
                                    <th>Last Message</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enquiries.filter(e => e.status !== 'closed').map(e => (
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
                                            <div style={{ color: '#666', fontSize: 11, lineHeight: 1.4, maxWidth: 200 }}>
                                                {e.message.slice(0, 60)}{e.message.length > 60 ? '...' : ''}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`ol-badge ol-status-${e.status || 'pending'}`}>
                                                {e.status}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 12, color: '#555', maxWidth: 160 }}>
                                            {e.messages?.[e.messages.length - 1]?.content.slice(0, 60) || 'None'}
                                        </td>
                                        <td style={{ fontSize: 12, color: '#888' }}>
                                            {new Date(e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button
                                                    className="ol-btn ol-btn-sm"
                                                    style={{ background: '#1a1a2e', color: '#fff' }}
                                                    onClick={() => { setSelected(e); setReply(''); }}
                                                >
                                                    View & Reply
                                                </button>
                                                {e.status !== 'closed' && (
                                                    <button
                                                        className="ol-btn ol-btn-sm"
                                                        style={{ background: '#fff', color: '#666', border: '1px solid #ddd' }}
                                                        onClick={() => handleClose(e._id)}
                                                    >
                                                        Close
                                                    </button>
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
                    <div className="ol-modal" style={{ maxWidth: 600, width: '100%' }} onClick={e => e.stopPropagation()}>
                        <div className="ol-modal-header">
                            <h2>Conversation Thread</h2>
                            <button onClick={() => setSelected(null)}><FiX /></button>
                        </div>
                        <div className="ol-modal-body" style={{ padding: '0 20px 20px' }}>
                            <div style={{ padding: '12px 0' }}>
                                <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 16 }}>{selected.subject}</div>
                                <div style={{ fontSize: 12, color: '#888' }}>Customer: {selected.customer?.name}</div>
                            </div>

                            {/* Thread area */}
                            <div style={{
                                maxHeight: 350,
                                overflowY: 'auto',
                                padding: '16px',
                                background: '#f8f9fa',
                                borderRadius: 12,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                                marginBottom: 20,
                                border: '1px solid #efefef'
                            }}>
                                {(selected.messages && selected.messages.length > 0 ? selected.messages : [{ sender: selected.customer, content: selected.message, createdAt: selected.createdAt }]).map((msg, idx) => {
                                    const isOwner = msg.sender?.role === 'owner' || msg.sender?.role === 'admin' || (typeof msg.sender === 'object' && msg.sender?.name === 'Owner');
                                    return (
                                        <div key={idx} style={{
                                            alignSelf: isOwner ? 'flex-end' : 'flex-start',
                                            maxWidth: '85%',
                                            padding: '10px 14px',
                                            borderRadius: 14,
                                            fontSize: '13px',
                                            background: isOwner ? '#fff4ef' : '#fff',
                                            color: isOwner ? '#1a1a2e' : '#333',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                            border: isOwner ? '1px solid #ff6b35' : '1px solid #eee'
                                        }}>
                                            <div style={{ fontWeight: 700, fontSize: '10px', marginBottom: 4, color: isOwner ? '#ff6b35' : '#888' }}>
                                                {isOwner ? 'You (Owner)' : (msg.sender?.name || 'Customer')}
                                            </div>
                                            <div style={{ lineHeight: 1.5 }}>{msg.content}</div>
                                            <div style={{ fontSize: '9px', color: '#999', textAlign: 'right', marginTop: 4 }}>
                                                {new Date(msg.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {selected.status !== 'closed' ? (
                                <form onSubmit={handleReply}>
                                    <div className="ol-form-group">
                                        <label style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, display: 'block' }}>Add your message</label>
                                        <textarea
                                            className="ol-input"
                                            style={{ minHeight: 100, padding: 12, borderRadius: 10, fontSize: 13 }}
                                            value={reply}
                                            onChange={e => setReply(e.target.value)}
                                            placeholder="Type your response here..."
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
                                        <button type="button" className="ol-btn" style={{ background: '#f5f5f5', color: '#666' }} onClick={() => setSelected(null)}>
                                            Close Modal
                                        </button>
                                        <button type="submit" className="ol-btn" style={{ background: '#1a1a2e', color: '#fff' }} disabled={saving}>
                                            <FiCornerUpRight style={{ marginRight: 6 }} />
                                            {saving ? 'Sending...' : 'Send Reply'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '20px',
                                    background: '#f8f9fa',
                                    borderRadius: '12px',
                                    border: '1px dashed #ddd',
                                    color: '#888'
                                }}>
                                    <FiX size={24} style={{ marginBottom: 10, opacity: 0.5 }} />
                                    <div>This enquiry is closed. No further replies can be sent.</div>
                                    <button
                                        className="ol-btn"
                                        style={{ marginTop: 16, background: '#f5f5f5', color: '#666' }}
                                        onClick={() => setSelected(null)}
                                    >
                                        Close Modal
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </OwnerLayout>
    );
};

export default OwnerEnquiries;

