import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getMyClaims } from '../api/customerApi';
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

export default function MyClaims() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        getMyClaims()
            .then((res) => setClaims(res.data || []))
            .catch(() => toast.error('Failed to load claims.'))
            .finally(() => setLoading(false));
    }, []);

    const statuses = ['ALL', 'PENDING', 'ASSIGNED', 'APPROVED', 'REJECTED', 'FINALIZED'];

    const filtered = filter === 'ALL' ? claims
        : claims.filter((c) => (c.status || c.claimStatus) === filter);

    const counts = statuses.reduce((acc, s) => {
        acc[s] = s === 'ALL' ? claims.length : claims.filter(c => (c.status || c.claimStatus) === s).length;
        return acc;
    }, {});

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="My Claims" />
                <div className="page-wrapper">
                    <div className="page-header">
                        <h1 className="page-title">My Claims</h1>
                        <p className="page-subtitle">Track the status of all your insurance claims</p>
                    </div>

                    {/* Summary Cards */}
                    {!loading && claims.length > 0 && (
                        <div className="grid grid-4" style={{ marginBottom: '1.5rem' }}>
                            {[
                                { label: 'Total', key: 'ALL', color: 'blue' },
                                { label: 'Pending', key: 'PENDING', color: 'yellow' },
                                { label: 'Approved', key: 'APPROVED', color: 'green' },
                                { label: 'Rejected', key: 'REJECTED', color: 'red' },
                            ].map((s) => (
                                <div key={s.key} className="stat-card" style={{ cursor: 'pointer' }}
                                    onClick={() => setFilter(s.key)}>
                                    <div className={`stat-icon stat-icon-${s.color}`}>{s.icon}</div>
                                    <div>
                                        <div className="stat-value">{counts[s.key]}</div>
                                        <div className="stat-label">{s.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Filter Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                        {statuses.map((s) => (
                            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter(s)}>
                                {s} {counts[s] > 0 && <span style={{ opacity: 0.7 }}>({counts[s]})</span>}
                            </button>
                        ))}
                    </div>

                    <div className="card">
                        {loading ? (
                            <div className="empty-state"><div className="spinner" /></div>
                        ) : filtered.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon"></div>
                                <p>{filter === 'ALL' ? 'No claims found. Raise your first claim!' : `No ${filter.toLowerCase()} claims.`}</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Policy</th>
                                            <th>Reason</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Surveyor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((claim, i) => (
                                            <tr key={claim.claimId || claim.id || i}>
                                                <td style={{ color: 'var(--text-muted)' }}>#{claim.claimId || claim.id || i + 1}</td>
                                                <td style={{ fontWeight: 600 }}>
                                                    {claim.policyName || claim.policy?.policyName || claim.customerPolicy?.policy?.policyName || '—'}
                                                </td>
                                                <td style={{ maxWidth: 200, color: 'var(--text-secondary)' }}>
                                                    <span title={claim.reason} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {claim.reason || '—'}
                                                    </span>
                                                </td>
                                                <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                                                    ₹{(claim.approvedAmount || claim.claimAmount || 0).toLocaleString()}
                                                </td>
                                                <td><StatusBadge status={claim.status || claim.claimStatus} /></td>
                                                <td style={{ color: 'var(--text-secondary)' }}>
                                                    {claim.surveyorName || claim.surveyor?.username || (
                                                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not assigned</span>
                                                    )}
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
