import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 
const RutaProtegidaUsuario = ({ children }) => {
    const { currentUser, loadingAuth } = useAuth();

    if (loadingAuth) {
        return <div>Loading authentication state...</div>; 
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
};

export default RutaProtegidaUsuario;