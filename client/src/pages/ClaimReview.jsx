import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { approveClaim, rejectClaim, getCoverageForClaim } from '../api/surveyorApi';
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

function DetailRow({ label, value, highlight }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{label}</span>
            <span style={{ fontWeight: 600, color: highlight || 'var(--text-primary)' }}>{value}</span>
        </div>
    );
}

export default function ClaimReview() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [claim, setClaim] = useState(location.state?.claim || null);
    const [coverage, setCoverage] = useState([]);
    const [remarks, setRemarks] = useState('');
    const [approvedAmount, setApprovedAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [decided, setDecided] = useState(false);

    const claimId = id || claim?.claimId || claim?.id;
    const currentStatus = (claim?.status || claim?.claimStatus)?.toUpperCase();
    const isActionable = currentStatus === 'ASSIGNED';

    const maxCoverage = coverage.reduce((sum, c) => sum + (c.coverageLimit || 0), 0);

    useEffect(() => {
        if (claimId) {
            getCoverageForClaim(claimId)
                .then((res) => {
                    setCoverage(res.data || []);
                })
                .catch(() => { });
        }
    }, [claimId]);

    const handleDecision = async (action) => {
        if (!remarks.trim() || remarks.trim().length < 5) {
            toast.error('Please provide remarks (min 5 characters).'); return;
        }

        const payload = {
            claimId: Number(claimId),
            remarks: remarks.trim()
        };

        if (action === 'approve') {
            const amount = parseFloat(approvedAmount);
            if (isNaN(amount) || amount <= 0) {
                toast.error('Please enter a valid approved amount.');
                return;
            }
            if (amount > maxCoverage && maxCoverage > 0) {
                toast.error(`Approved amount cannot exceed total coverage limit of ₹${maxCoverage.toLocaleString()}.`);
                return;
            }
            payload.approvedAmount = amount;
        }

        setSubmitting(true);
        try {
            const fn = action === 'approve' ? approveClaim : rejectClaim;
            const res = await fn(payload);
            const updated = res.data;
            setClaim(updated);
            setDecided(true);
            toast.success(`Claim ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
        } catch (err) {
            toast.error(err.response?.data?.error || err.response?.data?.message || `Failed to ${action} claim.`);
        } finally {
            setSubmitting(false);
        }
    };

    if (!claim) {
        return (
            <div className="app-layout">
                <Sidebar />
                <div className="main-content">
                    <Navbar title="Claim Review" />
                    <div className="page-wrapper">
                        <div className="empty-state">
                            <div className="empty-state-icon"></div>
                            <p>Claim not found. Please go back and select a claim.</p>
                            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => navigate('/surveyor/claims')}>
                                ← Back to Claims
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="Claim Review" />
                <div className="page-wrapper">
                    <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                            <h1 className="page-title">Review Claim #{claimId}</h1>
                            <p className="page-subtitle">Examine details and make your decision</p>
                        </div>
                        <button className="btn btn-secondary" onClick={() => navigate('/surveyor/claims')}>← Back</button>
                    </div>

                    <div className="grid grid-2" style={{ gap: '1.5rem', alignItems: 'flex-start' }}>
                        {/* Claim Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Claim Details</h3>
                                    <StatusBadge status={currentStatus} />
                                </div>
                                <DetailRow label="Claim ID" value={`#${claimId}`} />
                                <DetailRow label="Customer" value={claim.customerName || claim.customer?.username || '—'} />
                                <DetailRow label="Policy" value={claim.policyName || claim.policy?.policyName || '—'} />
                                <DetailRow label="Claim Amount" value={`₹${(claim.claimAmount || 0).toLocaleString()}`} highlight="var(--accent-primary)" />
                                <div style={{ paddingTop: '0.75rem' }}>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Reason</div>
                                    <div style={{ padding: '0.875rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                                        {claim.reason || 'No reason provided.'}
                                    </div>
                                </div>
                            </div>

                            {/* Coverage Details */}
                            {coverage.length > 0 && (
                                <div className="card">
                                    <div className="card-header"><h3 className="card-title">Policy Coverage</h3></div>
                                    <div className="table-wrapper">
                                        <table className="table">
                                            <thead><tr><th>Coverage</th><th>Limit</th></tr></thead>
                                            <tbody>
                                                {coverage.map((c, i) => (
                                                    <tr key={c.id || i}>
                                                        <td style={{ fontWeight: 600 }}>{c.coverageName}</td>
                                                        <td style={{ color: 'var(--success)', fontWeight: 700 }}>₹{(c.coverageLimit || 0).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Decision Panel */}
                        <div className="card" style={{ position: 'sticky', top: '80px' }}>
                            <div className="card-header"><h3 className="card-title">Your Decision</h3></div>

                            {decided || !isActionable ? (
                                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>
                                        {(claim.status || claim.claimStatus) === 'APPROVED' ? '' : (claim.status || claim.claimStatus) === 'REJECTED' ? '' : ''}
                                    </div>
                                    <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                        {decided ? 'Decision Recorded' : 'Decision Finalized'}
                                    </p>
                                    <StatusBadge status={claim.status || claim.claimStatus} />
                                    <button className="btn btn-secondary btn-full" style={{ marginTop: '1.5rem' }}
                                        onClick={() => navigate('/surveyor/claims')}>
                                        ← Back to Claims
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div style={{ padding: '0.875rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        This action is <strong>irreversible</strong>. Review all claim details carefully before deciding.
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Approved Amount (₹) *</label>
                                        <input type="number" className="form-control"
                                            placeholder={`Max available: ₹${maxCoverage.toLocaleString()}`}
                                            value={approvedAmount} onChange={(e) => setApprovedAmount(e.target.value)} />
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                                            Must be less than or equal to total coverage limit.
                                        </p>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Your Remarks *</label>
                                        <textarea id="remarks" className="form-control"
                                            placeholder="Enter your assessment and justification for the decision..."
                                            style={{ minHeight: 120 }}
                                            value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                                            {remarks.length} characters (min. 5)
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <button className="btn btn-success btn-full" disabled={submitting}
                                            onClick={() => handleDecision('approve')}>
                                            {submitting ? 'Processing...' : 'Approve Claim'}
                                        </button>
                                        <button className="btn btn-danger btn-full" disabled={submitting}
                                            onClick={() => handleDecision('reject')}>
                                            {submitting ? 'Processing...' : 'Reject Claim'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
