import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Shared Pages
import Dashboard from './pages/Dashboard';

// Customer Pages
import Profile from './pages/Profile';
import UploadDocument from './pages/UploadDocument';
import Policies from './pages/Policies';
import ApplyPolicy from './pages/ApplyPolicy';
import RaiseClaim from './pages/RaiseClaim';
import MyClaims from './pages/MyClaims';

// Admin Pages
import AdminPolicies from './pages/AdminPolicies';
import AdminClaims from './pages/AdminClaims';
import AssignSurveyor from './pages/AssignSurveyor';

// Surveyor Pages
import SurveyorClaims from './pages/SurveyorClaims';
import ClaimReview from './pages/ClaimReview';

// Root redirect based on role
function RoleRedirect() {
    const { user, isAuthenticated, loading } = useAuth();
    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/claims" replace />;
    if (user.role === 'SURVEYOR') return <Navigate to="/surveyor/claims" replace />;
    return <Navigate to="/customer/policies" replace />;
}

// 404 / Unauthorized page
function NotFound({ code = 404, message = 'Page not found' }) {
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)'
        }}>
            <div style={{ fontSize: '5rem' }}>{code === 401 ? '🔒' : '🌐'}</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{code}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
            <a href="/" style={{ marginTop: '0.5rem', padding: '0.625rem 1.5rem', background: 'var(--accent-gradient)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
                Go Home
            </a>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#1a2236',
                            color: '#f0f4ff',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            fontSize: '0.875rem',
                            fontFamily: 'Inter, sans-serif',
                        },
                        success: { iconTheme: { primary: '#10b981', secondary: '#1a2236' } },
                        error: { iconTheme: { primary: '#ef4444', secondary: '#1a2236' } },
                        duration: 3500,
                    }}
                />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Root — redirect based on role */}
                    <Route path="/" element={<RoleRedirect />} />

                    {/* Shared Protected */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    {/* ── CUSTOMER Routes ── */}
                    <Route path="/customer/profile" element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="/customer/documents" element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <UploadDocument />
                        </ProtectedRoute>
                    } />
                    <Route path="/customer/policies" element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <Policies />
                        </ProtectedRoute>
                    } />
                    <Route path="/customer/apply-policy" element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <ApplyPolicy />
                        </ProtectedRoute>
                    } />
                    <Route path="/customer/raise-claim" element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <RaiseClaim />
                        </ProtectedRoute>
                    } />
                    <Route path="/customer/claims" element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <MyClaims />
                        </ProtectedRoute>
                    } />

                    {/* ── ADMIN Routes ── */}
                    <Route path="/admin/policies" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminPolicies />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/claims" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminClaims />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/assign-surveyor" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AssignSurveyor />
                        </ProtectedRoute>
                    } />

                    {/* ── SURVEYOR Routes ── */}
                    <Route path="/surveyor/claims" element={
                        <ProtectedRoute allowedRoles={['SURVEYOR']}>
                            <SurveyorClaims />
                        </ProtectedRoute>
                    } />
                    <Route path="/surveyor/review/:id" element={
                        <ProtectedRoute allowedRoles={['SURVEYOR']}>
                            <ClaimReview />
                        </ProtectedRoute>
                    } />

                    {/* Error Pages */}
                    <Route path="/unauthorized" element={<NotFound code={401} message="You are not authorized to view this page." />} />
                    <Route path="*" element={<NotFound code={404} message="The page you're looking for doesn't exist." />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
