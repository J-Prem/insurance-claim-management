import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getActivePolicies, getMyCoverage, getMyPolicies, getMyClaims } from '../api/customerApi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Policies() {
    const [policies, setPolicies] = useState([]);
    const [coverage, setCoverage] = useState([]);
    const [myPolicies, setMyPolicies] = useState([]);
    const [myClaims, setMyClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('available');

    useEffect(() => {
        Promise.allSettled([getActivePolicies(), getMyCoverage(), getMyPolicies(), getMyClaims()])
            .then(([pRes, cRes, myPRes, myCRes]) => {
                if (pRes.status === 'fulfilled') setPolicies(pRes.value.data || []);
                if (cRes.status === 'fulfilled') setCoverage(cRes.value.data || []);
                if (myPRes.status === 'fulfilled') setMyPolicies(myPRes.value.data || []);
                if (myCRes.status === 'fulfilled') setMyClaims(myCRes.value.data || []);
            })
            .catch(() => toast.error('Failed to load policies.'))
            .finally(() => setLoading(false));
    }, []);

    const hasActiveClaim = myClaims.some(c =>
        ['PENDING', 'ASSIGNED', 'APPROVED', 'FINALIZED'].includes(c.status)
    );
    const hasPendingApp = myPolicies.some(p => p.status === 'PENDING');
    const isRestricted = hasActiveClaim || hasPendingApp;

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="Policies" />
                <div className="page-wrapper">
                    <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h1 className="page-title">Policies</h1>
                            <p className="page-subtitle">Browse available policies and view your active coverage</p>
                        </div>
                        <Link
                            to="/customer/apply-policy"
                            className={`btn btn-primary ${isRestricted ? 'disabled' : ''}`}
                            onClick={(e) => isRestricted && e.preventDefault()}
                        >
                            Apply for Policy
                        </Link>
                    </div>

                    {isRestricted && activeTab === 'available' && (
                        <div style={{
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '10px',
                            color: '#fca5a5',
                            fontSize: '0.875rem'
                        }}>
                            <strong>Note:</strong> You cannot apply for a new policy while a claim or application is active.
                        </div>
                    )}

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {['available', 'my-coverage'].map((tab) => (
                            <button key={tab} className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setActiveTab(tab)}>
                                {tab === 'available' ? `Available (${policies.length})` : `My Coverage (${coverage.length})`}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="empty-state"><div className="spinner" /></div>
                    ) : activeTab === 'available' ? (
                        policies.length === 0 ? (
                            <div className="card"><div className="empty-state">
                                <div className="empty-state-icon"></div>
                                <p>No policies available at the moment.</p>
                            </div></div>
                        ) : (
                            <div className="grid grid-3">
                                {policies.map((p) => (
                                    <div key={p.id || p.policyId} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{p.policyName}</h3>
                                                {p.active && <span className="badge badge-approved">Active</span>}
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                                                {p.description || 'Comprehensive insurance coverage policy.'}
                                            </p>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '0.75rem' }}>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Premium</div>
                                                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-primary)', marginTop: '0.25rem' }}>
                                                    ₹{(p.premiumAmount || 0).toLocaleString()}
                                                </div>
                                            </div>
                                            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '0.75rem' }}>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coverage</div>
                                                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--success)', marginTop: '0.25rem' }}>
                                                    ₹{(p.coverageAmount || 0).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            to={isRestricted ? '#' : "/customer/apply-policy"}
                                            state={isRestricted ? null : { policyId: p.id || p.policyId, policyName: p.policyName }}
                                            className={`btn btn-primary btn-full ${isRestricted ? 'disabled' : ''}`}
                                            onClick={(e) => isRestricted && e.preventDefault()}
                                        >
                                            {isRestricted ? 'Application Restricted' : 'Apply Now'}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        coverage.length === 0 ? (
                            <div className="card"><div className="empty-state">
                                <div className="empty-state-icon"></div>
                                <p>No active coverage found. Apply for a policy first.</p>
                            </div></div>
                        ) : (
                            <div className="card">
                                <div className="table-wrapper">
                                    <table className="table">
                                        <thead>
                                            <tr><th>Coverage Name</th><th>Policy</th><th>Limit</th></tr>
                                        </thead>
                                        <tbody>
                                            {coverage.map((c, i) => (
                                                <tr key={c.id || i}>
                                                    <td style={{ fontWeight: 600 }}>{c.coverageName}</td>
                                                    <td>{c.policy?.policyName || '—'}</td>
                                                    <td style={{ color: 'var(--success)', fontWeight: 700 }}>
                                                        ₹{(c.coverageLimit || 0).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
