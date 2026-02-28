import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { assignSurveyor, getAvailableSurveyors } from '../api/adminApi';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AssignSurveyor() {
    const location = useLocation();
    const navigate = useNavigate();
    const preClaimId = location.state?.claimId || '';

    const [form, setForm] = useState({ claimId: preClaimId, surveyorId: '' });
    const [submitting, setSubmitting] = useState(false);
    const [lastAssignment, setLastAssignment] = useState(null);

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.claimId || !form.surveyorId) {
            toast.error('Please enter both Claim ID and Surveyor ID.'); return;
        }
        setSubmitting(true);
        try {
            const res = await assignSurveyor({
                claimId: Number(form.claimId),
                surveyorId: Number(form.surveyorId),
            });
            toast.success('Surveyor assigned successfully!');
            setLastAssignment(res.data);
            setForm({ claimId: '', surveyorId: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to assign surveyor.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="Assign Surveyor" />
                <div className="page-wrapper">
                    <div className="page-header">
                        <h1 className="page-title">Assign Surveyor</h1>
                        <p className="page-subtitle">Assign a surveyor to review an insurance claim</p>
                    </div>

                    <div style={{ maxWidth: 600 }}>
                        <div className="card" style={{ marginBottom: '1.5rem' }}>
                            <div className="card-header"><h3 className="card-title">Assignment Form</h3></div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Claim ID *</label>
                                    <input id="claimId" name="claimId" type="number" min="1" className="form-control"
                                        placeholder="Enter the Claim ID" value={form.claimId} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Surveyor ID *</label>
                                    <input
                                        id="surveyorId"
                                        name="surveyorId"
                                        type="number"
                                        min="1"
                                        className="form-control"
                                        placeholder="Enter the Surveyor ID"
                                        value={form.surveyorId}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div style={{ padding: '0.875rem', background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    Once assigned, the claim status will change to <strong>ASSIGNED</strong> and the surveyor can review it.
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                                        {submitting ? <span className="inline-spinner" /> : '👤'}
                                        {submitting ? 'Assigning...' : 'Assign Surveyor'}
                                    </button>
                                    <button type="button" className="btn btn-secondary"
                                        onClick={() => navigate('/admin/claims')}>
                                        ← Back to Claims
                                    </button>
                                </div>
                            </form>
                        </div>

                        {lastAssignment && (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">✅ Assignment Confirmed</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {[
                                        ['Claim ID', `#${lastAssignment.claimId || '—'}`],
                                        ['Surveyor', lastAssignment.surveyorName || lastAssignment.surveyor?.username || '—'],
                                        ['New Status', lastAssignment.status || lastAssignment.claimStatus || 'ASSIGNED'],
                                        ['Policy', lastAssignment.policyName || '—'],
                                    ].map(([k, v]) => (
                                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{k}</span>
                                            <span style={{ fontWeight: 600 }}>{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
