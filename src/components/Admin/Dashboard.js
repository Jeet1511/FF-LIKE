import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/adminApi';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentLikes, setRecentLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError('');
        try {
            const [statsRes, likesRes] = await Promise.all([
                dashboardService.getStats(7),
                dashboardService.getRecentLikes(20)
            ]);
            setStats(statsRes.data);
            setRecentLikes(likesRes.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner-large"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p>{error}</p>
                <button onClick={fetchDashboardData} className="retry-button">Retry</button>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <button onClick={fetchDashboardData} className="refresh-button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" />
                    </svg>
                    Refresh
                </button>
            </div>

            {stats && (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Servers</p>
                                <h3 className="stat-value">{stats.overview.total_servers}</h3>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Active Accounts</p>
                                <h3 className="stat-value">{stats.overview.total_accounts}</h3>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Valid Tokens</p>
                                <h3 className="stat-value">{stats.overview.total_tokens}</h3>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Likes Sent</p>
                                <h3 className="stat-value">{stats.recent_activity.total_likes_sent}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="servers-section">
                        <h2>Server Status</h2>
                        <div className="servers-grid">
                            {Object.entries(stats.servers).map(([serverCode, serverData]) => (
                                <div key={serverCode} className="server-card">
                                    <div className="server-header">
                                        <h3>{serverCode}</h3>
                                        <span className={`status-badge ${serverData.status}`}>
                                            {serverData.status}
                                        </span>
                                    </div>
                                    <div className="server-stats">
                                        <div className="server-stat">
                                            <span className="label">Accounts:</span>
                                            <span className="value">{serverData.accounts}</span>
                                        </div>
                                        <div className="server-stat">
                                            <span className="label">Tokens:</span>
                                            <span className="value">{serverData.tokens}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <div className="recent-likes-section">
                <h2>Recent Activity</h2>
                {recentLikes.length > 0 ? (
                    <div className="table-container">
                        <table className="recent-likes-table">
                            <thead>
                                <tr>
                                    <th>UID</th>
                                    <th>Likes Sent</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentLikes.map((like, index) => (
                                    <tr key={index}>
                                        <td className="uid-cell">{like.uid}</td>
                                        <td className="likes-cell">
                                            <span className="likes-badge">{like.likes_sent}</span>
                                        </td>
                                        <td className="time-cell">
                                            {new Date(like.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <p>No recent activity</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
