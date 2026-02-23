import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { FiMessageSquare, FiTrash2, FiX } from 'react-icons/fi';

const AdminEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [reply, setReply] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get('/enquiries').then(r => setEnquiries(r.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this enquiry?')) return;
        try {
            await api.delete(`/enquiries/${id}`);
            setEnquiries(enquiries.filter(e => e._id !== id));
        } catch (err) { alert('Delete failed'); }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.patch(`/enquiries/${selected._id}`, { reply, status: 'replied' });
            setEnquiries(enquiries.map(e => e._id === selected._id ? data : e));
            setSelected(null); setReply('');
        } catch (err) { alert('Failed to send reply'); }
        finally { setSaving(false); }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                <div className="page-header">
                    <h1>📩 All Enquiries</h1>
                    <p>View, reply and manage all customer enquiries</p>
                </div>

                <div className="card">
                    {loading ? <div className="loading-spinner"><div className="spinner" /></div> : enquiries.length === 0 ? (
                        <div className="empty-state"><FiMessageSquare size={48} /><h3>No enquiries found</h3></div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr><th>#</th><th>Customer</th><th>Type</th><th>Subject</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {enquiries.map((e, i) => (
                                        <tr key={e._id}>
                                            <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{e.customer?.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.customer?.email}</div>
                                            </td>
                                            <td><span className="badge badge-confirmed">{e.type}</span></td>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{e.subject}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.message.slice(0, 60)}{e.message.length > 60 ? '...' : ''}</div>
                                            </td>
                                            <td><span className={`badge badge-${e.status}`}>{e.status}</span></td>
                                            <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(e.createdAt).toLocaleDateString('en-IN')}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    {e.status !== 'closed' && (
                                                        <button className="btn btn-primary btn-sm" onClick={() => { setSelected(e); setReply(e.reply || ''); }}>Reply</button>
                                                    )}
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e._id)}><FiTrash2 /></button>
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
                    <div className="modal-overlay" onClick={() => setSelected(null)}>
                        <div className="modal" onClick={ev => ev.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Reply to Enquiry</h2>
                                <button className="modal-close" onClick={() => setSelected(null)}><FiX /></button>
                            </div>
                            <div style={{ marginBottom: 16, padding: '12px 14px', background: 'var(--bg-card2)', borderRadius: 8 }}>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>From: {selected.customer?.name} ({selected.customer?.email})</div>
                                <div style={{ fontWeight: 600, marginBottom: 6 }}>{selected.subject}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selected.message}</div>
                            </div>
                            <form onSubmit={handleReply}>
                                <div className="form-group">
                                    <label>Your Reply</label>
                                    <textarea className="textarea" style={{ minHeight: 120 }} value={reply} onChange={e => setReply(e.target.value)} placeholder="Write your reply..." required />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Sending...' : '📨 Send Reply'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminEnquiries;
