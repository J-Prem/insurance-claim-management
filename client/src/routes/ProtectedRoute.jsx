import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) return <Loader />;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
