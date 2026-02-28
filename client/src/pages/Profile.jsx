import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getMyProfile, saveProfile } from '../api/customerApi';
import toast from 'react-hot-toast';

export default function Profile() {
    const [form, setForm] = useState({ fullName: '', phone: '', address: '', dateOfBirth: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileCompleted, setProfileCompleted] = useState(false);

    useEffect(() => {
        getMyProfile()
            .then((res) => {
                const d = res.data;
                setForm({
                    fullName: d.fullName || '',
                    phone: d.phone || '',
                    address: d.address || '',
                    dateOfBirth: d.dateOfBirth || '',
                });
                setProfileCompleted(d.profileCompleted || false);
            })
            .catch(() => { }) // profile may not exist yet
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.fullName || !form.phone || !form.address || !form.dateOfBirth) {
            toast.error('Please fill in all fields.');
            return;
        }
        setSaving(true);
        try {
            await saveProfile({ ...form, profileCompleted: true });
            setProfileCompleted(true);
            toast.success('Profile saved successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save profile.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="My Profile" />
                <div className="page-wrapper">
                    <div className="page-header">
                        <h1 className="page-title">My Profile</h1>
                        <p className="page-subtitle">Complete your profile to access all features</p>
                    </div>

                    <div style={{ maxWidth: 600 }}>
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Personal Information</h3>
                                {profileCompleted && <span className="badge badge-approved">Complete</span>}
                            </div>

                            {loading ? (
                                <div className="empty-state"><div className="spinner" /></div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input id="fullName" name="fullName" type="text" className="form-control"
                                            placeholder="Your full legal name" value={form.fullName} onChange={handleChange} />
                                    </div>
                                    <div className="grid grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Phone Number</label>
                                            <input id="phone" name="phone" type="tel" className="form-control"
                                                placeholder="+91 9876543210" value={form.phone} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Date of Birth</label>
                                            <input id="dateOfBirth" name="dateOfBirth" type="date" className="form-control"
                                                value={form.dateOfBirth} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Address</label>
                                        <textarea id="address" name="address" className="form-control"
                                            placeholder="Enter your full address..." value={form.address} onChange={handleChange} />
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Profile'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
