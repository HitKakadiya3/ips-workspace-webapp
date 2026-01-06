import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ children, allowedRoles }) => {
    const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem('user') || '{}');

    // Check if user has one of the allowed roles
    if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
        // Redirect to dashboard if authorized but wrong role, or login if no user
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default RoleRoute;
