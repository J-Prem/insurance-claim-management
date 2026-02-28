import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import toast from 'react-hot-toast';

export default function Register() {
    const [form, setForm] = useState({ username: '', password: '', confirmPassword: '', role: 'CUSTOMER' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const validate = () => {
        if (!form.username || !form.password) return 'Please fill in all fields.';
        if (form.username.length < 3) return 'Username must be at least 3 characters.';
        if (form.password.length < 6) return 'Password must be at least 6 characters.';
        if (form.password !== form.confirmPassword) return 'Passwords do not match.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setError('');
        setLoading(true);
        try {
            await registerUser({ username: form.username, password: form.password, role: form.role });
            toast.success('Account created! Please sign in.');
            navigate('/login');
        } catch (err) {
            const rawMsg = err.response?.data?.error || err.response?.data?.message || err.response?.data;
            const msg = typeof rawMsg === 'string' ? rawMsg : 'Registration failed. Please check if the backend is running and the username is unique.';
            setError(msg);
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
                    <h1 className="auth-title">Join SafeGuard</h1>
                    <p className="auth-subtitle">Start your premium insurance journey</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input id="reg-username" name="username" type="text" className="form-control"
                            placeholder="Choose a username" value={form.username} onChange={handleChange} autoFocus />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Role</label>
                        <select id="reg-role" name="role" className="form-control" value={form.role} onChange={handleChange}>
                            <option value="CUSTOMER">Customer</option>
                            <option value="SURVEYOR">Surveyor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input id="reg-password" name="password" type="password" className="form-control"
                            placeholder="Create a password (min. 6 chars)" value={form.password} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input id="reg-confirm" name="confirmPassword" type="password" className="form-control"
                            placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
