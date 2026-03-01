import React, { useState } from 'react';
import CustomerLayout from '../../components/CustomerLayout';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import api from '../../services/api';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        street: user?.street || '',
        city: user?.city || '',
        state: user?.state || 'Rajasthan',
        zip: user?.zip || '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    if (!user) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { data } = await api.put('/auth/profile', formData);
            updateUser(data);
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomerLayout>
            <div className="profile-container">
                {message.text && (
                    <div className={`profile-msg ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="profile-header">
                    <div className="profile-avatar-large">
                        {user.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="profile-intro-row">
                        <div className="profile-intro">
                            <h1>{user.name}</h1>
                            <p className="profile-role-badge">{user.role?.toUpperCase()}</p>
                        </div>
                        {!isEditing && (
                            <button className="profile-edit-trigger" onClick={() => setIsEditing(true)}>
                                <FiEdit2 /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="profile-grid">
                        {/* Personal Information */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <FiUser /> <h2>Personal Information</h2>
                            </div>
                            <div className="profile-info-list">
                                <div className="info-item">
                                    <label><FiUser /> Full Name</label>
                                    {isEditing ? (
                                        <input className="profile-input" name="name" value={formData.name} onChange={handleChange} required />
                                    ) : (
                                        <span>{user.name}</span>
                                    )}
                                </div>
                                <div className="info-item">
                                    <label><FiMail /> Email Address</label>
                                    <span>{user.email} (Non-editable)</span>
                                </div>
                                <div className="info-item">
                                    <label><FiPhone /> Phone Number</label>
                                    {isEditing ? (
                                        <input className="profile-input" name="phone" value={formData.phone} onChange={handleChange} required />
                                    ) : (
                                        <span>{user.phone || 'Not provided'}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Address Details */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <FiMapPin /> <h2>Address Details</h2>
                            </div>
                            <div className="profile-info-list">
                                <div className="info-item">
                                    <label>Street</label>
                                    {isEditing ? (
                                        <input className="profile-input" name="street" value={formData.street} onChange={handleChange} required />
                                    ) : (
                                        <span>{user.street || 'Not provided'}</span>
                                    )}
                                </div>
                                <div className="info-item">
                                    <label>City</label>
                                    {isEditing ? (
                                        <input className="profile-input" name="city" value={formData.city} onChange={handleChange} required />
                                    ) : (
                                        <span>{user.city || 'Not provided'}</span>
                                    )}
                                </div>
                                <div className="info-item">
                                    <label>State</label>
                                    {isEditing ? (
                                        <input className="profile-input" name="state" value={formData.state} onChange={handleChange} required />
                                    ) : (
                                        <span>{user.state || 'Rajasthan'}</span>
                                    )}
                                </div>
                                <div className="info-item">
                                    <label>ZIP Code</label>
                                    {isEditing ? (
                                        <input className="profile-input" name="zip" value={formData.zip} onChange={handleChange} required />
                                    ) : (
                                        <span>{user.zip || 'Not provided'}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Account Details */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <FiCalendar /> <h2>Account Details</h2>
                            </div>
                            <div className="profile-info-list">
                                <div className="info-item">
                                    <label>Member Since</label>
                                    <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                    <label>Account Status</label>
                                    <span className="status-badge-active">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="profile-actions-sticky">
                            <button type="button" className="profile-btn-cancel" onClick={() => { setIsEditing(false); setFormData({ name: user.name, phone: user.phone, street: user.street, city: user.city, state: user.state, zip: user.zip }); }} disabled={loading}>
                                <FiX /> Cancel
                            </button>
                            <button type="submit" className="profile-btn-save" disabled={loading}>
                                {loading ? 'Saving...' : <><FiCheck /> Save Changes</>}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </CustomerLayout>
    );
};

export default Profile;
