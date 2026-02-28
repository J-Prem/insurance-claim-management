import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ title = 'SafeGuard Insurance' }) {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <span className="navbar-title">{title}</span>
            </div>
            <div className="navbar-right">
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={toggleTheme}
                    title="Toggle Theme"
                    style={{ fontSize: '1.2rem', padding: '0.25rem 0.5rem' }}
                >
                    {isDarkMode ? '☀️' : '🌑'}
                </button>
                {user && (
                    <>
                        <span className={`badge badge-${user.role?.toLowerCase()}`}>
                            {user.role}
                        </span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
                            {user.username}
                        </span>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
