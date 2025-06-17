import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import './AdminLayout.css';
import { useAuth } from '../context/AuthContext.jsx';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    return (
        <aside className="admin-layout-sidebar">
            <div className="admin-layout-sidebar-header">
                <h3>Admin Panel</h3>
            </div>
            <nav className="admin-layout-sidebar-nav">
                <ul>
                    <li><NavLink to="/admin/dashboard"><i className="bi bi-clipboard2-data"></i> Dashboard</NavLink></li>
                    <li><NavLink to="/admin/productos"><i className="bi bi-handbag"></i> Products</NavLink></li>
                    <li><NavLink to="/admin/pedidos"><i className="bi bi-cart2"></i> Orders</NavLink></li>
                    <li><NavLink to="/admin/usuarios"><i className="bi bi-person"></i> Users</NavLink></li>
                </ul>
            </nav>
            <div className="admin-layout-sidebar-footer">
                <button onClick={handleLogout} className="admin-layout-logout-button">
                    <i className="bi bi-box-arrow-right"></i> Logout
                </button>
            </div>
        </aside>
    );
};

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-layout-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;