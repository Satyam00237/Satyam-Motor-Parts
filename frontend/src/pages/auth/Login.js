import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post(`${process.env.SERVER_URL}/api/auth/login`, form);
            login(data);
            if (data.role === 'admin') navigate('/admin/dashboard');
            else if (data.role === 'owner') navigate('/owner/dashboard');
            else navigate('/customer/products');

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-box">
                <div className="auth-logo">
                    <div className="logo-icon">🔧</div>
                    <h1>Satyam Motor Parts</h1>
                    <p>Automobile Parts & Service Shop</p>
                </div>
                <h2>Welcome Back</h2>
                <p className="sub">Sign in to your account</p>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <FiMail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="input"
                                style={{ paddingLeft: 36 }}
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="input"
                                style={{ paddingLeft: 36, paddingRight: 36 }}
                                type={showPw ? 'text' : 'password'}
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                                {showPw ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    <button className="btn btn-primary w-full" style={{ justifyContent: 'center', padding: '12px' }} type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Register here</Link>
                </div>

            </div>
        </div>
    );
};

export default Login;
