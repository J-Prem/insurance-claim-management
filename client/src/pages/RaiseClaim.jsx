import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getMyCoverage, raiseClaim } from '../api/customerApi';
import toast from 'react-hot-toast';

export default function RaiseClaim() {
    const navigate = useNavigate();
    const [coverage, setCoverage] = useState([]);
    const [form, setForm] = useState({ customerPolicyId: '', reason: '', claimAmount: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getMyCoverage()
            .then((res) => setCoverage(res.data || []))
            .catch(() => toast.error('Failed to load policies.'))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));



    // Get unique customer policies from coverage data
    const policies = coverage.reduce((acc, c) => {
        const cp = c.customerPolicy;
        if (cp && !acc.find((a) => a.id === cp.id)) {
            acc.push({
                id: cp.id,
                name: cp.policy?.policyName || `Policy #${cp.id}`,
                maxCoverage: cp.policy?.coverageAmount || 0,
                status: cp.status
            });
        }
        return acc;
    }, []);

    const selectedPolicy = policies.find(p => p.id === Number(form.customerPolicyId));

    const validate = () => {
        if (!form.customerPolicyId) return 'Please select a policy.';
        if (selectedPolicy?.status !== 'ACTIVE') return 'You can only raise claims for ACTIVE policies.';
        if (!form.reason.trim() || form.reason.trim().length < 10) return 'Please describe the reason (min. 10 characters).';
        const amount = parseFloat(form.claimAmount);
        if (!amount || amount <= 0) return 'Please enter a valid claim amount.';
        if (selectedPolicy && amount > selectedPolicy.maxCoverage) {
            return `Claim amount exceeds your policy coverage limit of ₹${selectedPolicy.maxCoverage.toLocaleString()}.`;
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { toast.error(err); return; }
        setSubmitting(true);
        try {
            await raiseClaim({
                customerPolicyId: Number(form.customerPolicyId),
                reason: form.reason.trim(),
                claimAmount: parseFloat(form.claimAmount),
            });
            toast.success('Claim raised successfully! We\'ll review it soon.');
            navigate('/customer/claims');
        } catch (err) {
            toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to raise claim. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="Raise a Claim" />
                <div className="page-wrapper">
                    <div className="page-header">
                        <h1 className="page-title">Raise a Claim</h1>
                        <p className="page-subtitle">Submit a new insurance claim against your active policies</p>
                    </div>

                    <div style={{ maxWidth: 620 }}>
                        <div className="card">
                            {loading ? (
                                <div className="empty-state"><div className="spinner" /></div>
                            ) : policies.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon"></div>
                                    <p>You have no active policies. Please apply for a policy first.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="form-label">Select Your Policy</label>
                                        <select id="policy-claim" name="customerPolicyId" className="form-control"
                                            value={form.customerPolicyId} onChange={handleChange}>
                                            <option value="">— Choose your policy —</option>
                                            {policies.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} (ID: {p.id}, Limit: ₹{p.maxCoverage.toLocaleString()})
                                                </option>
                                            ))}
                                        </select>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                                            Select the policy you are claiming against. You can only claim once per policy.
                                        </p>
                                    </div>

                                    {selectedPolicy && (
                                        <div className="form-group">
                                            <label className="form-label">Claim Amount (₹)</label>
                                            <input id="claimAmount" name="claimAmount" type="number" min="1" step="0.01"
                                                className="form-control" placeholder={`Enter amount (Max: ₹${selectedPolicy.maxCoverage.toLocaleString()})`}
                                                max={selectedPolicy.maxCoverage}
                                                value={form.claimAmount} onChange={handleChange} />
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label className="form-label">Reason for Claim</label>
                                        <textarea id="reason" name="reason" className="form-control"
                                            placeholder="Describe the incident in detail — what happened, when, and any relevant details..."
                                            style={{ minHeight: 130 }}
                                            value={form.reason} onChange={handleChange} />
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                                            {form.reason.length} characters (min. 10)
                                        </p>
                                    </div>
                                    <div style={{ padding: '0.875rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        By submitting, you confirm that all information is accurate and a surveyor will be assigned to review your claim.
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                                            {submitting ? 'Submitting...' : 'Submit Claim'}
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
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
