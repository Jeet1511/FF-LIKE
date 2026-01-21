import React, { useState, useEffect } from 'react';
import { accountService, serverService } from '../../services/adminApi';
import './AccountManagement.css';

const AccountManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [servers, setServers] = useState([]);
    const [selectedServer, setSelectedServer] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        uid: '',
        password: '',
        server: 'IND',
        name: '',
        account_id: 1
    });

    useEffect(() => {
        fetchData();
    }, [selectedServer]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [accountsRes, serversRes] = await Promise.all([
                accountService.getAll(selectedServer),
                serverService.getAll()
            ]);
            setAccounts(accountsRes.data);
            setServers(serversRes.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAccount = async (e) => {
        e.preventDefault();
        try {
            await accountService.add(formData);
            setShowAddModal(false);
            setFormData({ uid: '', password: '', server: 'IND', name: '', account_id: 1 });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add account');
        }
    };

    const handleDeleteAccount = async (accountId) => {
        if (!window.confirm('Are you sure you want to delete this account?')) return;

        try {
            await accountService.delete(accountId);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete account');
        }
    };

    const groupedAccounts = accounts.reduce((acc, account) => {
        if (!acc[account.server]) acc[account.server] = [];
        acc[account.server].push(account);
        return acc;
    }, {});

    return (
        <div className="account-management">
            <div className="page-header">
                <h1>Account Management</h1>
                <button onClick={() => setShowAddModal(true)} className="add-button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Account
                </button>
            </div>

            <div className="filters">
                <select
                    value={selectedServer}
                    onChange={(e) => setSelectedServer(e.target.value)}
                    className="server-filter"
                >
                    <option value="">All Servers</option>
                    <option value="IND">India (IND)</option>
                    <option value="BR">Brazil (BR)</option>
                    <option value="BD">Bangladesh (BD)</option>
                    <option value="US">USA (US)</option>
                    <option value="SAC">South America (SAC)</option>
                </select>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner-large"></div>
                    <p>Loading accounts...</p>
                </div>
            ) : (
                <div className="accounts-container">
                    {Object.entries(groupedAccounts).map(([server, serverAccounts]) => (
                        <div key={server} className="server-group">
                            <div className="server-group-header">
                                <h2>{server}</h2>
                                <span className="account-count">{serverAccounts.length} accounts</span>
                            </div>
                            <div className="accounts-grid">
                                {serverAccounts.map((account) => (
                                    <div key={account.id} className="account-card">
                                        <div className="account-header">
                                            <div className="account-avatar">
                                                {account.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="account-info">
                                                <h3>{account.name}</h3>
                                                <p className="uid">UID: {account.uid}</p>
                                            </div>
                                        </div>
                                        <div className="account-details">
                                            <div className="detail-row">
                                                <span className="label">Account ID:</span>
                                                <span className="value">{account.account_id}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Added:</span>
                                                <span className="value">
                                                    {new Date(account.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteAccount(account.id)}
                                            className="delete-button"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {accounts.length === 0 && (
                        <div className="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
                            </svg>
                            <p>No accounts found</p>
                        </div>
                    )}
                </div>
            )}

            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New Account</h2>
                            <button onClick={() => setShowAddModal(false)} className="close-button">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddAccount} className="modal-form">
                            <div className="form-group">
                                <label>UID *</label>
                                <input
                                    type="number"
                                    value={formData.uid}
                                    onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                                    placeholder="Enter UID"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password *</label>
                                <input
                                    type="text"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter password hash"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Server *</label>
                                <select
                                    value={formData.server}
                                    onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                                    required
                                >
                                    <option value="IND">India (IND)</option>
                                    <option value="BR">Brazil (BR)</option>
                                    <option value="BD">Bangladesh (BD)</option>
                                    <option value="US">USA (US)</option>
                                    <option value="SAC">South America (SAC)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Account Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter account name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Account ID</label>
                                <input
                                    type="number"
                                    value={formData.account_id}
                                    onChange={(e) => setFormData({ ...formData, account_id: parseInt(e.target.value) })}
                                    placeholder="1"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowAddModal(false)} className="cancel-button">
                                    Cancel
                                </button>
                                <button type="submit" className="submit-button">
                                    Add Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountManagement;
