import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getMyClaims, getActivePolicies, getMyPolicies } from '../api/customerApi';
import { getAllClaims } from '../api/adminApi';
import { getAssignedClaims } from '../api/surveyorApi';

function StatCard({ icon, value, label, color = 'blue' }) {
    return (
        <div className="stat-card">
            <div className={`stat-icon stat-icon-${color}`}>{icon}</div>
            <div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const s = status?.toLowerCase();
    return <span className={`badge badge-${s}`}>{status}</span>;
}

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({});
    const [recentClaims, setRecentClaims] = useState([]);
    const [myPolicies, setMyPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.role === 'CUSTOMER') {
                    const [claimsRes, policiesRes, myPoliciesRes] = await Promise.allSettled([
                        getMyClaims(),
                        getActivePolicies(),
                        getMyPolicies()
                    ]);
                    const claims = claimsRes.status === 'fulfilled' ? claimsRes.value.data : [];
                    const policies = policiesRes.status === 'fulfilled' ? policiesRes.value.data : [];
                    const myPol = myPoliciesRes.status === 'fulfilled' ? myPoliciesRes.value.data : [];

                    setStats({
                        totalClaims: claims.length,
                        pendingClaims: claims.filter(c => c.status === 'PENDING').length,
                        approvedClaims: claims.filter(c => c.status === 'APPROVED').length,
                        availablePolicies: policies.length,
                    });
                    setRecentClaims(claims.slice(0, 5));
                    setMyPolicies(myPol);
                } else if (user?.role === 'ADMIN') {
                    const res = await getAllClaims();
                    const claims = res.data || [];
                    setStats({
                        totalClaims: claims.length,
                        pendingClaims: claims.filter(c => c.status === 'PENDING').length,
                        approvedClaims: claims.filter(c => c.status === 'APPROVED').length,
                        rejectedClaims: claims.filter(c => c.status === 'REJECTED').length,
                    });
                    setRecentClaims(claims.slice(0, 5));
                } else if (user?.role === 'SURVEYOR') {
                    const res = await getAssignedClaims();
                    const claims = res.data || [];
                    setStats({
                        assignedClaims: claims.length,
                        pendingReview: claims.filter(c => c.status === 'ASSIGNED').length,
                        approved: claims.filter(c => c.status === 'APPROVED').length,
                        rejected: claims.filter(c => c.status === 'REJECTED').length,
                    });
                    setRecentClaims(claims.slice(0, 5));
                }
            } catch (e) {
                console.error('Dashboard fetch error:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const customerStats = [
        { value: stats.availablePolicies ?? 0, label: 'Available Policies', color: 'blue' },
        { value: stats.totalClaims ?? 0, label: 'Total Claims', color: 'purple' },
        { value: stats.pendingClaims ?? 0, label: 'Pending Claims', color: 'yellow' },
        { value: stats.approvedClaims ?? 0, label: 'Approved Claims', color: 'green' },
    ];

    const adminStats = [
        { value: stats.totalClaims ?? 0, label: 'Total Claims', color: 'blue' },
        { value: stats.pendingClaims ?? 0, label: 'Pending', color: 'yellow' },
        { value: stats.approvedClaims ?? 0, label: 'Approved', color: 'green' },
        { value: stats.rejectedClaims ?? 0, label: 'Rejected', color: 'red' },
    ];

    const surveyorStats = [
        { value: stats.assignedClaims ?? 0, label: 'Assigned Claims', color: 'blue' },
        { value: stats.pendingReview ?? 0, label: 'Pending Review', color: 'yellow' },
        { value: stats.approved ?? 0, label: 'Approved', color: 'green' },
        { value: stats.rejected ?? 0, label: 'Rejected', color: 'red' },
    ];

    const statCards = user?.role === 'CUSTOMER' ? customerStats : user?.role === 'ADMIN' ? adminStats : surveyorStats;

    const quickLinks = {
        CUSTOMER: [
            { to: '/customer/apply-policy', label: 'Apply for a Policy' },
            { to: '/customer/policies', label: 'Browse Policies' },
            { to: '/customer/raise-claim', label: 'Raise a Claim' },
            { to: '/customer/claims', label: 'Track Claims' },
            { to: '/customer/profile', label: 'Update Profile' },
        ],
        ADMIN: [
            { to: '/admin/policies', label: 'Create Policy' },
            { to: '/admin/claims', label: 'View All Claims' },
            { to: '/admin/assign-surveyor', label: 'Assign Surveyor' },
        ],
        SURVEYOR: [
            { to: '/surveyor/claims', label: 'View Assigned Claims' },
        ],
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="Dashboard" />
                <div className="page-wrapper">
                    <div className="page-header">
                        <h1 className="page-title">Welcome, {user?.username}!</h1>
                        <p className="page-subtitle">Here's an overview of your insurance portal activity.</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="stat-card" style={{ animation: 'pulse 1.5s infinite' }}>
                                    <div style={{ width: '100%', height: 60, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
                            {statCards.map((s, i) => <StatCard key={i} {...s} />)}
                        </div>
                    )}

                    {user?.role === 'CUSTOMER' && (() => {
                        const hasActiveClaim = recentClaims.some(c =>
                            ['PENDING', 'ASSIGNED', 'APPROVED', 'FINALIZED'].includes(c.status)
                        );
                        const hasPendingApp = myPolicies.some(p => p.status === 'PENDING');

                        if (hasActiveClaim || hasPendingApp) {
                            return (
                                <div style={{
                                    marginBottom: '2rem',
                                    padding: '1.25rem',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    color: '#fca5a5'
                                }}>
                                    <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                                    <div>
                                        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Policy Application Restricted</div>
                                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                            You cannot apply for a new policy while a claim or application is active.
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                        {/* Recent Claims */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Recent Claims</h3>
                            </div>
                            {recentClaims.length === 0 ? (
                                <div className="empty-state">
                                    <p>No claims found</p>
                                </div>
                            ) : (
                                <div className="table-wrapper">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentClaims.map((claim, i) => (
                                                <tr key={claim.claimId || claim.id || i}>
                                                    <td>#{claim.claimId || claim.id || i + 1}</td>
                                                    <td>₹{(claim.claimAmount || 0).toLocaleString()}</td>
                                                    <td><StatusBadge status={claim.status || claim.claimStatus} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Quick Actions</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {(quickLinks[user?.role] || []).map((link) => (
                                    <Link key={link.to} to={link.to} className="btn btn-secondary btn-full"
                                        style={{ justifyContent: 'flex-start' }}>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
