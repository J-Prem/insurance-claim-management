import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navConfig = {
    ADMIN: [
        { to: '/admin/claims', label: 'All Claims' },
        { to: '/admin/policies', label: 'Policies' },
        { to: '/admin/assign-surveyor', label: 'Assign Surveyor' },
    ],
    CUSTOMER: [
        { to: '/customer/policies', label: 'Browse Policies' },
        { to: '/customer/apply-policy', label: 'Apply for Policy' },
        { to: '/customer/raise-claim', label: 'Raise Claim' },
        { to: '/customer/claims', label: 'My Claims' },
        { to: '/customer/profile', label: 'My Profile' },
        { to: '/customer/documents', label: 'Documents' },
    ],
    SURVEYOR: [
        { to: '/surveyor/claims', label: 'Assigned Claims' },
    ],
};

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const links = navConfig[user?.role] || [];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-text" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px' }} />
                    SafeGuard
                </div>
                <div className="sidebar-logo-sub">PREMIUM INSURANCE</div>
            </div>

            <div className="sidebar-section">
                <div className="sidebar-section-label">Navigation</div>
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                    >
                        {link.label}
                    </NavLink>
                ))}
            </div>

            <div className="sidebar-section">
                <div className="sidebar-section-label">Dashboard</div>
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                >
                    Dashboard
                </NavLink>
            </div>

            <div className="sidebar-footer">
                <div style={{ marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span className={`badge badge-${user?.role?.toLowerCase()}`}>{user?.role}</span>
                    <div style={{ marginTop: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {user?.username}
                    </div>
                </div>
                <button className="btn btn-secondary btn-full" onClick={handleLogout}>
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
