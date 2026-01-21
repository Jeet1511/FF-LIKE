import React, { useEffect } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { adminAuthService } from '../../services/adminApi';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const currentUser = adminAuthService.getCurrentUser();

    useEffect(() => {
        if (!adminAuthService.isAuthenticated()) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            adminAuthService.logout();
        }
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div className="admin-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2>FF-Likes Admin</h2>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        Dashboard
                    </NavLink>

                    <NavLink to="/admin/accounts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
                        </svg>
                        Accounts
                    </NavLink>

                    <NavLink to="/admin/tokens" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        Tokens
                    </NavLink>
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div className="user-avatar">
                            {currentUser?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                            <p className="user-name">{currentUser?.username}</p>
                            <p className="user-role">Administrator</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
