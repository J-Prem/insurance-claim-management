export default function Loader() {
    return (
        <div className="loader-overlay">
            <div style={{ textAlign: 'center' }}>
                <div className="spinner" />
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Loading...
                </p>
            </div>
        </div>
    );
}
