import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children, roles, redirectTo = '/login' }) => {
    const { isAuthed, role } = useAuth();

    if (!isAuthed) return <Navigate to={redirectTo} replace />;

    if (roles && roles.length > 0 && !roles.includes(role)) {
        const home = role === 'attendee' ? '/dashboard' : '/admin';
        return <Navigate to={home} replace />;
    }

    return children;
};

export default ProtectedRoute;

export { ProtectedRoute };
