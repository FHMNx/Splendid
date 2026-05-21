import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (user?.role !== `ADMIN`) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />

}

export default AdminRoute