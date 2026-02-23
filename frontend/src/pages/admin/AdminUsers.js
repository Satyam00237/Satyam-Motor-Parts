import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { FiUsers, FiTrash2 } from 'react-icons/fi';

const ROLES = ['customer', 'owner', 'admin'];

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/users').then(r => setUsers(r.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleRoleChange = async (id, role) => {
        try {
            const { data } = await api.patch(`/users/${id}/role`, { role });
            setUsers(users.map(u => u._id === id ? { ...u, role: data.role } : u));
        } catch (err) { alert('Role update failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user? This cannot be undone.')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) { alert('Delete failed'); }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                <div className="page-header">
                    <h1>👥 User Management</h1>
                    <p>View, manage roles, and remove users from the system</p>
                </div>

                <div className="card">
                    {loading ? <div className="loading-spinner"><div className="spinner" /></div> : users.length === 0 ? (
                        <div className="empty-state"><FiUsers size={48} /><h3>No users found</h3></div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {users.map((u, i) => (
                                        <tr key={u._id}>
                                            <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                                            <td style={{ fontWeight: 600 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{
                                                        width: 32, height: 32, borderRadius: '50%',
                                                        background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: 13, fontWeight: 700, color: 'var(--primary)', flexShrink: 0,
                                                    }}>
                                                        {u.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    {u.name}
                                                </div>
                                            </td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                                            <td style={{ color: 'var(--text-muted)' }}>{u.phone || '—'}</td>
                                            <td>
                                                <select
                                                    className="select"
                                                    style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }}
                                                    value={u.role}
                                                    onChange={e => handleRoleChange(u._id, e.target.value)}
                                                >
                                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                            </td>
                                            <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                                            <td>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}><FiTrash2 /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminUsers;
