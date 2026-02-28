import { useAuth } from '../context/AuthContext';

/**
 * Conditionally renders children only if the user has one of the allowed roles.
 * Usage: <RoleGuard roles={['ADMIN']}><AdminOnlyContent /></RoleGuard>
 */
export default function RoleGuard({ roles, children, fallback = null }) {
    const { user } = useAuth();
    if (!user || !roles.includes(user.role)) return fallback;
    return children;
}
