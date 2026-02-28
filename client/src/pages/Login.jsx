import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/authApi';
import toast from 'react-hot-toast';

export default function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username || !form.password) {
            setError('Please fill in all fields.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await loginUser(form);
            const { token, role } = res.data;
            login(token);

            toast.success(`Welcome back! Logged in as ${role}`);
            // Redirect based on role
            if (role === 'ADMIN') navigate('/admin/claims');
            else if (role === 'CUSTOMER') navigate('/customer/policies');
            else if (role === 'SURVEYOR') navigate('/surveyor/claims');
            else navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || 'Invalid credentials.';
            setError(typeof msg === 'string' ? msg : 'Login failed. Please try again.');
            toast.error('Login failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="auth-logo-icon" style={{ padding: '15px' }}>
                        <img src="/logo.png" alt="SafeGuard" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <h1 className="auth-title">SafeGuard Insurance</h1>
                    <p className="auth-subtitle">Premium Claim Management Portal</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            className="form-control"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={handleChange}
                            autoComplete="username"
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="auth-link">Create Account</Link>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo Roles</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {[['ADMIN', 'admin'], ['CUSTOMER', 'customer'], ['SURVEYOR', 'surveyor']].map(([role, user]) => (
                            <div key={role} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <span className={`badge badge-${role.toLowerCase()}`} style={{ marginRight: '0.5rem' }}>{role}</span>
                                {user} / &lt;your_password&gt;
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
