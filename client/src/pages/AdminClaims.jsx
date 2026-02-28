import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getAllClaims } from '../api/adminApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function StatusBadge({ status }) {
    const s = status?.toLowerCase();
    const icons = {
        pending: '',
        assigned: '',
        approved: '',
        rejected: '',
        finalized: '',
        settled: '',
        closed: ''
    };
    return <span className={`badge badge-${s}`}>{icons[s] || ''} {status}</span>;
}

export default function AdminClaims() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const fetchClaims = () => {
        setLoading(true);
        getAllClaims()
            .then((res) => setClaims(res.data || []))
            .catch(() => toast.error('Failed to load claims.'))
            .finally(() => setLoading(false));
    };

    useEffect(fetchClaims, []);

    const statuses = ['ALL', 'PENDING', 'ASSIGNED', 'APPROVED', 'REJECTED', 'FINALIZED'];
    const counts = statuses.reduce((acc, s) => {
        acc[s] = s === 'ALL' ? claims.length : claims.filter(c => (c.status || c.claimStatus) === s).length;
        return acc;
    }, {});

    const filtered = claims
        .filter((c) => filter === 'ALL' || (c.status || c.claimStatus) === filter)
        .filter((c) => !search || JSON.stringify(c).toLowerCase().includes(search.toLowerCase()));

    const totalAmount = claims.reduce((sum, c) => sum + (c.claimAmount || 0), 0);

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="Admin — All Claims" />
                <div className="page-wrapper">
                    <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                            <h1 className="page-title">All Claims</h1>
                            <p className="page-subtitle">View and manage all insurance claims in the system</p>
                        </div>
                        <button className="btn btn-secondary" onClick={fetchClaims}>Refresh</button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-4" style={{ marginBottom: '1.5rem' }}>
                        {[
                            { value: counts.ALL, label: 'Total Claims', color: 'blue' },
                            { value: counts.PENDING, label: 'Pending', color: 'yellow' },
                            { value: counts.APPROVED, label: 'Approved', color: 'green' },
                            { value: `₹${totalAmount.toLocaleString()}`, label: 'Total Amount', color: 'purple' },
                        ].map((s, i) => (
                            <div key={i} className="stat-card">
                                <div className={`stat-icon stat-icon-${s.color}`}>{s.icon}</div>
                                <div>
                                    <div className="stat-value" style={{ fontSize: s.icon === '💰' ? '1.1rem' : undefined }}>{s.value}</div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {statuses.map((s) => (
                            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter(s)}>
                                {s} ({counts[s]})
                            </button>
                        ))}
                        <input type="text" className="form-control" style={{ maxWidth: 240, padding: '0.4rem 0.875rem', fontSize: '0.85rem' }}
                            placeholder="Search claims..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    <div className="card">
                        {loading ? (
                            <div className="empty-state"><div className="spinner" /></div>
                        ) : filtered.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon"></div>
                                <p>No claims match your filter.</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Customer</th>
                                            <th>Policy</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Surveyor</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((claim, i) => (
                                            <tr key={claim.claimId || claim.id || i}>
                                                <td style={{ color: 'var(--text-muted)' }}>#{claim.claimId || claim.id}</td>
                                                <td style={{ fontWeight: 600 }}>{claim.customerName || claim.customer?.username || '—'}</td>
                                                <td>{claim.policyName || claim.policy?.policyName || '—'}</td>
                                                <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                                                    ₹{(claim.claimAmount || 0).toLocaleString()}
                                                </td>
                                                <td><StatusBadge status={claim.status || claim.claimStatus} /></td>
                                                <td style={{ color: 'var(--text-secondary)' }}>
                                                    {claim.surveyorName || claim.surveyor?.username || (
                                                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        disabled={['APPROVED', 'FINALIZED', 'SETTLED', 'CLOSED'].includes((claim.status || claim.claimStatus)?.toUpperCase())}
                                                        onClick={() => navigate('/admin/assign-surveyor', { state: { claimId: claim.claimId || claim.id } })}>
                                                        Assign
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
