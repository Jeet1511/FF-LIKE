import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import {
    BarChart3,
    RefreshCw,
    Server,
    Users,
    Key,
    CheckCircle2,
    XCircle,
    Loader2,
    Database
} from 'lucide-react';
import './Dashboard.css';
import './IconAnimations.css';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setError(null);
            const data = await apiService.getMongoStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
            setError('Failed to load statistics. Please check if the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await apiService.forceRefresh();
            await loadStats();
            alert('✅ Tokens refreshed successfully!');
        } catch (error) {
            alert('❌ Failed to refresh tokens. Please try again.');
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <Loader2 className="spinner-large animate-spin" size={60} />
                <p>Loading statistics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <h3>
                    <XCircle className="animate-shake" size={32} />
                    Error
                </h3>
                <p>{error}</p>
                <button onClick={loadStats} className="retry-btn">
                    <RefreshCw size={20} />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>
                        <BarChart3 className="header-icon animate-pulse-slow" size={48} />
                        API Dashboard
                    </h1>
                    <p>Monitor your Free Fire likes system</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="refresh-btn"
                    disabled={refreshing}
                >
                    {refreshing ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Refreshing...
                        </>
                    ) : (
                        <>
                            <RefreshCw size={20} />
                            Refresh Tokens
                        </>
                    )}
                </button>
            </div>

            {stats && stats.mongodb_connected && (
                <div className="connection-status">
                    <Database className="status-indicator connected animate-pulse-slow" size={16} />
                    <span>MongoDB Connected</span>
                </div>
            )}

            {stats && stats.statistics && (
                <div className="stats-grid">
                    {Object.entries(stats.statistics.servers).map(([server, data]) => (
                        <div key={server} className="server-card">
                            <div className="server-header">
                                <h3>
                                    <Server size={24} />
                                    {getServerFlag(server)} {server}
                                </h3>
                                <span className={`server-status ${data.valid_tokens > 0 ? 'active' : 'inactive'}`}>
                                    {data.valid_tokens > 0 ? (
                                        <>
                                            <CheckCircle2 size={14} />
                                            Active
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={14} />
                                            Inactive
                                        </>
                                    )}
                                </span>
                            </div>

                            <div className="server-stats">
                                <div className="stat-item">
                                    <Users className="stat-icon animate-pulse-slow" size={28} />
                                    <div className="stat-info">
                                        <span className="stat-label">Accounts</span>
                                        <span className="stat-value">{data.accounts}</span>
                                    </div>
                                </div>

                                <div className="stat-item">
                                    <Key className="stat-icon animate-bounce-slow" size={28} />
                                    <div className="stat-info">
                                        <span className="stat-label">Valid Tokens</span>
                                        <span className="stat-value">{data.valid_tokens}</span>
                                    </div>
                                </div>
                            </div>

                            {data.valid_tokens === 0 && data.accounts > 0 && (
                                <div className="warning-message">
                                    ⚠️ Tokens need refresh
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {stats && stats.timestamp && (
                <div className="dashboard-footer">
                    <p>Last updated: {new Date(stats.timestamp).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
}

function getServerFlag(server) {
    const flags = {
        'IND': '🇮🇳',
        'BR': '🇧🇷',
        'US': '🇺🇸',
        'BD': '🇧🇩',
        'SAC': '🌎',
        'NA': '🌎'
    };
    return flags[server] || '🌍';
}

export default Dashboard;
