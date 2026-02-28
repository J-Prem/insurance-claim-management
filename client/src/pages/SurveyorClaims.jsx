import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getAssignedClaims } from '../api/surveyorApi';
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

export default function SurveyorClaims() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const navigate = useNavigate();

    const fetchClaims = () => {
        setLoading(true);
        getAssignedClaims()
            .then((res) => setClaims(res.data || []))
            .catch(() => toast.error('Failed to load assigned claims.'))
            .finally(() => setLoading(false));
    };

    useEffect(fetchClaims, []);

    const statuses = ['ALL', 'ASSIGNED', 'APPROVED', 'REJECTED', 'FINALIZED'];
    const counts = statuses.reduce((acc, s) => {
        acc[s] = s === 'ALL' ? claims.length : claims.filter(c => (c.status || c.claimStatus) === s).length;
        return acc;
    }, {});

    const filtered = filter === 'ALL' ? claims
        : claims.filter((c) => (c.status || c.claimStatus) === filter);

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="Assigned Claims" />
                <div className="page-wrapper">
                    <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                            <h1 className="page-title">🔍 Assigned Claims</h1>
                            <p className="page-subtitle">Review and decide on claims assigned to you</p>
                        </div>
                        <button className="btn btn-secondary" onClick={fetchClaims}>Refresh</button>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-4" style={{ marginBottom: '1.5rem' }}>
                        {[
                            { value: counts.ALL, label: 'Total Assigned', color: 'blue' },
                            { value: counts.ASSIGNED, label: 'Pending Review', color: 'yellow' },
                            { value: counts.APPROVED, label: 'Approved', color: 'green' },
                            { value: counts.REJECTED, label: 'Rejected', color: 'red' },
                        ].map((s, i) => (
                            <div key={i} className="stat-card">
                                <div className={`stat-icon stat-icon-${s.color}`}>{s.icon}</div>
                                <div>
                                    <div className="stat-value">{s.value}</div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filter Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                        {statuses.map((s) => (
                            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter(s)}>
                                {s} ({counts[s]})
                            </button>
                        ))}
                    </div>

                    <div className="card">
                        {loading ? (
                            <div className="empty-state"><div className="spinner" /></div>
                        ) : filtered.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon"></div>
                                <p>No claims found for this filter.</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Customer</th>
                                            <th>Policy</th>
                                            <th>Reason</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((claim, i) => {
                                            const id = claim.claimId || claim.id;
                                            const statusRaw = (claim.status || claim.claimStatus)?.toUpperCase();
                                            const isActionable = statusRaw === 'ASSIGNED';
                                            return (
                                                <tr key={id || i}>
                                                    <td style={{ color: 'var(--text-muted)' }}>#{id}</td>
                                                    <td style={{ fontWeight: 600 }}>{claim.customerName || claim.customer?.username || '—'}</td>
                                                    <td>{claim.policyName || claim.policy?.policyName || '—'}</td>
                                                    <td style={{ maxWidth: 180 }}>
                                                        <span title={claim.reason} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                                                            {claim.reason || '—'}
                                                        </span>
                                                    </td>
                                                    <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                                                        ₹{(claim.claimAmount || 0).toLocaleString()}
                                                    </td>
                                                    <td><StatusBadge status={claim.status || claim.claimStatus} /></td>
                                                    <td>
                                                        {isActionable ? (
                                                            <button className="btn btn-sm btn-primary"
                                                                onClick={() => navigate(`/surveyor/review/${id}`, { state: { claim } })}>
                                                                Review
                                                            </button>
                                                        ) : (
                                                            <button className="btn btn-sm btn-secondary"
                                                                onClick={() => navigate(`/surveyor/review/${id}`, { state: { claim } })}>
                                                                View
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
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
