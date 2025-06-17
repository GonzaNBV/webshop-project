import React from 'react';
import { Outlet } from 'react-router-dom';

const RutaProtegidaAdmin = ({ children }) => {
    console.log("RutaProtegidaAdmin: Permitiendo acceso.");
    return children ? children : <Outlet />;
};

export default RutaProtegidaAdmin;