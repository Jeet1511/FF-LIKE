import React, { useState, useEffect } from 'react';
import { tokenService } from '../../services/adminApi';
import './TokenManagement.css';

const TokenManagement = () => {
    const [tokenStatus, setTokenStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(null);

    useEffect(() => {
        fetchTokenStatus();
    }, []);

    const fetchTokenStatus = async () => {
        setLoading(true);
        try {
            const response = await tokenService.getStatus();
            setTokenStatus(response.data);
        } catch (err) {
            console.error('Failed to fetch token status:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async (server = null) => {
        setRefreshing(server || 'all');
        try {
            await tokenService.refresh(server);
            await fetchTokenStatus();
            alert(server ? `Tokens refreshed for ${server}` : 'All tokens refreshed successfully');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to refresh tokens');
        } finally {
            setRefreshing(null);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner-large"></div>
                <p>Loading token status...</p>
            </div>
        );
    }

    return (
        <div className="token-management">
            <div className="page-header">
                <h1>Token Management</h1>
                <button
                    onClick={() => handleRefresh(null)}
                    className="refresh-all-button"
                    disabled={refreshing !== null}
                >
                    {refreshing === 'all' ? (
                        <>
                            <span className="spinner-small"></span>
                            Refreshing...
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" />
                            </svg>
                            Refresh All Tokens
                        </>
                    )}
                </button>
            </div>

            <div className="info-banner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4m0-4h.01" />
                </svg>
                <div>
                    <p className="banner-title">Token Refresh Information</p>
                    <p className="banner-text">
                        Tokens are automatically refreshed when expired. Manual refresh generates new JWT tokens for all accounts in the selected server.
                    </p>
                </div>
            </div>

            {tokenStatus && (
                <div className="tokens-grid">
                    {Object.entries(tokenStatus).map(([server, status]) => (
                        <div key={server} className="token-card">
                            <div className="token-card-header">
                                <div className="server-info">
                                    <h3>{server}</h3>
                                    <span className={`status-indicator ${status.valid_tokens > 0 ? 'active' : 'inactive'}`}>
                                        {status.valid_tokens > 0 ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <div className="token-stats">
                                <div className="stat-item">
                                    <div className="stat-icon valid">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                    </div>
                                    <div className="stat-details">
                                        <p className="stat-label">Valid Tokens</p>
                                        <p className="stat-value">{status.valid_tokens}</p>
                                    </div>
                                </div>

                                <div className="stat-item">
                                    <div className="stat-icon total">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0110 0v4" />
                                        </svg>
                                    </div>
                                    <div className="stat-details">
                                        <p className="stat-label">Total Tokens</p>
                                        <p className="stat-value">{status.total_tokens}</p>
                                    </div>
                                </div>
                            </div>

                            {status.next_expiry && (
                                <div className="expiry-info">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <div>
                                        <p className="expiry-label">Next Expiry</p>
                                        <p className="expiry-time">
                                            {new Date(status.next_expiry).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => handleRefresh(server)}
                                className="refresh-button"
                                disabled={refreshing !== null}
                            >
                                {refreshing === server ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Refreshing...
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" />
                                        </svg>
                                        Refresh Tokens
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TokenManagement;
