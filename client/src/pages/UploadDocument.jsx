import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { uploadDocument } from '../api/customerApi';
import toast from 'react-hot-toast';

const DOCUMENT_TYPES = [
    { value: 'AADHAR', label: 'Aadhaar Card' },
    { value: 'PAN', label: 'PAN Card' },
    { value: 'PASSPORT', label: 'Passport' },
    { value: 'DRIVING_LICENSE', label: 'Driving License' },
    { value: 'INCOME_PROOF', label: 'Income Proof' },
    { value: 'ADDRESS_PROOF', label: 'Address Proof' },
];

export default function UploadDocument() {
    const [docType, setDocType] = useState('AADHAR');
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState([]);
    const inputRef = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) setFile(dropped);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) { toast.error('Please select a file.'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('File size must be under 5MB.'); return; }
        setUploading(true);
        try {
            await uploadDocument(docType, file);
            toast.success(`${docType} uploaded successfully!`);
            setUploaded((prev) => [...prev, { type: docType, name: file.name, size: file.size }]);
            setFile(null);
            if (inputRef.current) inputRef.current.value = '';
        } catch (err) {
            toast.error(err.response?.data || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar title="Upload Documents" />
                <div className="page-wrapper">
                    <div className="page-header">
                        <h1 className="page-title">Upload Documents</h1>
                        <p className="page-subtitle">Upload KYC and supporting documents for your claims</p>
                    </div>

                    <div style={{ maxWidth: 640 }}>
                        <div className="card" style={{ marginBottom: '1.5rem' }}>
                            <div className="card-header">
                                <h3 className="card-title">Upload New Document</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Document Type</label>
                                    <select id="docType" className="form-control" value={docType}
                                        onChange={(e) => setDocType(e.target.value)}>
                                        {DOCUMENT_TYPES.map((t) => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div
                                    className={`upload-zone${dragging ? ' drag-over' : ''}`}
                                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => inputRef.current?.click()}
                                >
                                    <div className="upload-zone-icon">{file ? '' : ''}</div>
                                    {file ? (
                                        <>
                                            <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{file.name}</p>
                                            <p style={{ marginTop: '0.25rem' }}>{formatSize(file.size)}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p><strong>Drag & drop</strong> your file here</p>
                                            <p>or <strong style={{ color: 'var(--accent-primary)' }}>click to browse</strong></p>
                                            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                PDF, JPG, PNG — Max 5MB
                                            </p>
                                        </>
                                    )}
                                    <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png"
                                        style={{ display: 'none' }}
                                        onChange={(e) => setFile(e.target.files[0] || null)} />
                                </div>

                                <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
                                    <button type="submit" className="btn btn-primary" disabled={uploading || !file}>
                                        {uploading ? 'Uploading...' : 'Upload Document'}
                                    </button>
                                    {file && (
                                        <button type="button" className="btn btn-secondary"
                                            onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ''; }}>
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {uploaded.length > 0 && (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Uploaded This Session</h3>
                                </div>
                                <div className="table-wrapper">
                                    <table className="table">
                                        <thead>
                                            <tr><th>Type</th><th>File</th><th>Size</th></tr>
                                        </thead>
                                        <tbody>
                                            {uploaded.map((d, i) => (
                                                <tr key={i}>
                                                    <td><span className="badge badge-customer">{d.type}</span></td>
                                                    <td>{d.name}</td>
                                                    <td>{formatSize(d.size)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
