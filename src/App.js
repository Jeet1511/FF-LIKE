import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Gamepad2, Send, BarChart3, Calendar, Instagram, Crown } from 'lucide-react';
import LikeSender from './components/LikeSender';
import Dashboard from './components/Dashboard';
import DailyStats from './components/DailyStats';
import AdminLogin from './components/Admin/AdminLogin';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/Dashboard';
import AccountManagement from './components/Admin/AccountManagement';
import TokenManagement from './components/Admin/TokenManagement';
import './App.css';

function App() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <Router>
            <div className="app">
                {/* Animated Background */}
                <div className="background-animation">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>

                {/* Navigation */}
                <nav className="navbar">
                    <div className="nav-container">
                        <div className="nav-brand">
                            <Gamepad2 className="brand-icon" size={32} />
                            <span className="brand-text">FF-Likes</span>
                        </div>

                        <button className="menu-toggle" onClick={toggleMenu}>
                            <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>

                        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                            <NavLink
                                to="/"
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                                onClick={closeMenu}
                            >
                                <Send className="nav-icon" size={20} />
                                Send Likes
                            </NavLink>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                                onClick={closeMenu}
                            >
                                <BarChart3 className="nav-icon" size={20} />
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/daily-stats"
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                                onClick={closeMenu}
                            >
                                <Calendar className="nav-icon" size={20} />
                                Daily Stats
                            </NavLink>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<LikeSender />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/daily-stats" element={<DailyStats />} />

                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="accounts" element={<AccountManagement />} />
                            <Route path="tokens" element={<TokenManagement />} />
                        </Route>
                    </Routes>
                </main>

                {/* Professional Footer with Instagram */}
                <footer className="footer">
                    <div className="footer-content">
                        <div className="footer-info">
                            <p>
                                Developed by <Crown className="inline-icon" size={16} /> <span className="highlight">God</span>
                            </p>
                            <p className="footer-note">
                                Free Fire Likes Management System
                            </p>
                        </div>

                        <a
                            href="https://instagram.com/_echo.del.alma_"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="instagram-btn"
                        >
                            <Instagram className="instagram-icon animate-pulse-slow" size={20} />
                            <span>Follow on Instagram</span>
                            <span className="instagram-handle">@_echo.del.alma_</span>
                        </a>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
