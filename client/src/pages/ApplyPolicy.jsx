import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getActivePolicies, applyPolicy, getMyPolicies, getMyClaims } from '../api/customerApi';
import toast from 'react-hot-toast';

export default function ApplyPolicy() {
    const location = useLocation();
    const navigate = useNavigate();
    const preselected = location.state?.policyId;

    const [policies, setPolicies] = useState([]);
    const [myPolicies, setMyPolicies] = useState([]);
    const [myClaims, setMyClaims] = useState([]);
    const [form, setForm] = useState({ policyId: preselected || '' });
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        Promise.allSettled([getActivePolicies(), getMyPolicies(), getMyClaims()])
            .then(([pRes, myPRes, myCRes]) => {
                const available = pRes.status === 'fulfilled' ? pRes.value.data : [];
                setPolicies(available);
                if (myPRes.status === 'fulfilled') setMyPolicies(myPRes.value.data || []);
                if (myCRes.status === 'fulfilled') setMyClaims(myCRes.value.data || []);

                if (preselected) {
                    const p = (available || []).find((x) => (x.id || x.policyId) === Number(preselected));
                    if (p) setSelectedPolicy(p);
                }
            })
            .catch(() => toast.error('Failed to load data.'))
            .finally(() => setLoading(false));
    }, [preselected]);

    const hasActiveClaim = myClaims.some(c =>
        ['PENDING', 'ASSIGNED', 'APPROVED', 'FINALIZED'].includes(c.status)
    );
    const hasPendingApp = myPolicies.some(p => p.status === 'PENDING');
    const isRestricted = hasActiveClaim || hasPendingApp;

    const handlePolicyChange = (e) => {
        const id = Number(e.target.value);
        setForm({ policyId: id });
        const p = policies.find((x) => (x.id || x.policyId) === id);
        setSelectedPolicy(p || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRestricted) {
            toast.error('You cannot apply for a new policy while a claim or application is active.');
            return;
        }
        if (!form.policyId) { toast.error('Please select a policy.'); return; }
        setSubmitting(true);
        try {
            await applyPolicy({ policyId: form.policyId });
            toast.success('Policy applied successfully!');
            navigate('/customer/policies');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to apply for policy.';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="Apply for Policy" />
                <div className="page-wrapper">
                    <div className="page-header">
                        <h1 className="page-title">Apply for Policy</h1>
                        <p className="page-subtitle">Select a policy and submit your application</p>
                    </div>

                    <div style={{ maxWidth: 600 }}>
                        <div className="card">
                            {loading ? (
                                <div className="empty-state"><div className="spinner" /></div>
                            ) : isRestricted ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>Application Restricted</h3>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                        You cannot apply for a new policy while a claim or application is active.
                                    </p>
                                    <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                                        Back to Dashboard
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="form-label">Select Policy</label>
                                        <select id="policy-select" className="form-control" value={form.policyId}
                                            onChange={handlePolicyChange}>
                                            <option value="">— Choose a policy —</option>
                                            {policies.map((p) => (
                                                <option key={p.id || p.policyId} value={p.id || p.policyId}>
                                                    {p.policyName} — ₹{(p.premiumAmount || 0).toLocaleString()}/yr
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedPolicy && (
                                        <div style={{ padding: '1.25rem', background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                                            <h4 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Policy Details</h4>
                                            <div className="grid grid-2" style={{ gap: '0.75rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Policy Name</div>
                                                    <div style={{ fontWeight: 600 }}>{selectedPolicy.policyName}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Annual Premium</div>
                                                    <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>₹{(selectedPolicy.premiumAmount || 0).toLocaleString()}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Total Coverage</div>
                                                    <div style={{ fontWeight: 700, color: 'var(--success)' }}>₹{(selectedPolicy.coverageAmount || 0).toLocaleString()}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Status</div>
                                                    <span className="badge badge-approved">Active</span>
                                                </div>
                                            </div>
                                            {selectedPolicy.description && (
                                                <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    {selectedPolicy.description}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button type="submit" className="btn btn-primary" disabled={submitting || !form.policyId}>
                                            {submitting ? 'Submitting...' : 'Submit Application'}
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
