import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { createPolicy, addCoverage } from '../api/adminApi';
import toast from 'react-hot-toast';

const EMPTY_POLICY = { policyName: '', description: '', premiumAmount: '', coverageAmount: '', active: true };
const EMPTY_COVERAGE = { policyId: '', coverageName: '', coverageLimit: '' };

export default function AdminPolicies() {
    const [tab, setTab] = useState('create-policy');
    const [policyForm, setPolicyForm] = useState(EMPTY_POLICY);
    const [coverageForm, setCoverageForm] = useState(EMPTY_COVERAGE);
    const [saving, setSaving] = useState(false);

    const handlePolicyChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPolicyForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleCoverageChange = (e) => setCoverageForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleCreatePolicy = async (e) => {
        e.preventDefault();
        if (!policyForm.policyName || !policyForm.premiumAmount || !policyForm.coverageAmount) {
            toast.error('Please fill all required fields.'); return;
        }
        setSaving(true);
        try {
            await createPolicy({
                policyName: policyForm.policyName,
                description: policyForm.description,
                premiumAmount: parseFloat(policyForm.premiumAmount),
                coverageAmount: parseFloat(policyForm.coverageAmount),
                active: policyForm.active,
            });
            toast.success('Policy created successfully!');
            setPolicyForm(EMPTY_POLICY);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create policy.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddCoverage = async (e) => {
        e.preventDefault();
        if (!coverageForm.policyId || !coverageForm.coverageName || !coverageForm.coverageLimit) {
            toast.error('Please fill all required fields.'); return;
        }
        setSaving(true);
        try {
            await addCoverage({
                policyId: Number(coverageForm.policyId),
                coverageName: coverageForm.coverageName,
                coverageLimit: parseFloat(coverageForm.coverageLimit),
            });
            toast.success('Coverage added successfully!');
            setCoverageForm(EMPTY_COVERAGE);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add coverage.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="Admin — Policies" />
                <div className="page-wrapper">
                    <div className="page-header">
                        <h1 className="page-title">Policy Management</h1>
                        <p className="page-subtitle">Create new policies and add coverage options</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <button className={`btn ${tab === 'create-policy' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('create-policy')}>Create Policy</button>
                        <button className={`btn ${tab === 'add-coverage' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('add-coverage')}>Add Coverage</button>
                    </div>

                    <div style={{ maxWidth: 600 }}>
                        {tab === 'create-policy' && (
                            <div className="card">
                                <div className="card-header"><h3 className="card-title">Create New Policy</h3></div>
                                <form onSubmit={handleCreatePolicy}>
                                    <div className="form-group">
                                        <label className="form-label">Policy Name *</label>
                                        <input id="policyName" name="policyName" type="text" className="form-control"
                                            placeholder="e.g., Comprehensive Health Plan" value={policyForm.policyName} onChange={handlePolicyChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea id="policyDescription" name="description" className="form-control"
                                            placeholder="Describe what this policy covers..." value={policyForm.description} onChange={handlePolicyChange} />
                                    </div>
                                    <div className="grid grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Annual Premium (₹) *</label>
                                            <input id="premiumAmount" name="premiumAmount" type="number" min="0" step="0.01"
                                                className="form-control" placeholder="e.g., 5000" value={policyForm.premiumAmount} onChange={handlePolicyChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Coverage Amount (₹) *</label>
                                            <input id="coverageAmount" name="coverageAmount" type="number" min="0" step="0.01"
                                                className="form-control" placeholder="e.g., 500000" value={policyForm.coverageAmount} onChange={handlePolicyChange} />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <input id="active" name="active" type="checkbox" style={{ width: 16, height: 16, accentColor: 'var(--accent-primary)' }}
                                            checked={policyForm.active} onChange={handlePolicyChange} />
                                        <label htmlFor="active" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Mark as Active (visible to customers)</label>
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? 'Creating...' : 'Create Policy'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {tab === 'add-coverage' && (
                            <div className="card">
                                <div className="card-header"><h3 className="card-title">Add Coverage to Policy</h3></div>
                                <form onSubmit={handleAddCoverage}>
                                    <div className="form-group">
                                        <label className="form-label">Policy ID *</label>
                                        <input id="coveragePolicyId" name="policyId" type="number" min="1" className="form-control"
                                            placeholder="Enter the Policy ID" value={coverageForm.policyId} onChange={handleCoverageChange} />
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                                            Enter the ID of the policy you want to add coverage to
                                        </p>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Coverage Name *</label>
                                        <input id="coverageName" name="coverageName" type="text" className="form-control"
                                            placeholder="e.g., Hospitalization, Accidental Death" value={coverageForm.coverageName} onChange={handleCoverageChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Coverage Limit (₹) *</label>
                                        <input id="coverageLimit" name="coverageLimit" type="number" min="0" step="0.01"
                                            className="form-control" placeholder="e.g., 200000" value={coverageForm.coverageLimit} onChange={handleCoverageChange} />
                                    </div>
                                    <button type="submit" className="btn btn-success" disabled={saving}>
                                        {saving ? 'Adding...' : 'Add Coverage'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
