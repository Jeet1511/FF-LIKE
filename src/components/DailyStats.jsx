import React, { useState } from 'react';
import { apiService } from '../services/api';
import {
    Calendar,
    Search,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Clock,
    Loader2,
    AlertTriangle
} from 'lucide-react';
import './DailyStats.css';
import './IconAnimations.css';

function DailyStats() {
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setStats(null);

        try {
            const data = await apiService.getDailyStats(uid);
            setStats(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch daily statistics');
        } finally {
            setLoading(false);
        }
    };

    const getProgressPercentage = () => {
        if (!stats || !stats.daily_stats) return 0;
        return (stats.daily_stats.used_today / 100) * 100;
    };

    return (
        <div className="daily-stats">
            <div className="daily-stats-header">
                <h1>
                    <Calendar className="header-icon animate-bounce-slow" size={48} />
                    Daily Statistics
                </h1>
                <p>Check daily like limits for any UID</p>
            </div>

            <form onSubmit={handleSubmit} className="stats-form">
                <div className="form-group">
                    <label htmlFor="uid">
                        <Search className="label-icon animate-pulse-slow" size={20} />
                        Enter User ID (UID)
                    </label>
                    <div className="input-group">
                        <input
                            id="uid"
                            type="text"
                            value={uid}
                            onChange={(e) => setUid(e.target.value)}
                            placeholder="Enter Free Fire UID"
                            required
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading} className="search-btn">
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <Search size={20} />
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {stats && stats.mongodb_connected && stats.daily_stats && (
                <div className="stats-result">
                    <div className="stats-card">
                        <div className="stats-header">
                            <h3>
                                <TrendingUp size={24} />
                                Statistics for UID: {stats.uid}
                            </h3>
                            <span className={`status-badge ${stats.daily_stats.can_send_more ? 'available' : 'limit-reached'}`}>
                                {stats.daily_stats.can_send_more ? (
                                    <>
                                        <CheckCircle2 size={14} />
                                        Available
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={14} />
                                        Limit Reached
                                    </>
                                )}
                            </span>
                        </div>

                        <div className="progress-section">
                            <div className="progress-header">
                                <span className="progress-label">Daily Usage</span>
                                <span className="progress-value">
                                    {stats.daily_stats.used_today} / 100
                                </span>
                            </div>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${getProgressPercentage()}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-box">
                                <CheckCircle2 className="stat-icon animate-scale-in" size={32} />
                                <div className="stat-content">
                                    <span className="stat-label">Used Today</span>
                                    <span className="stat-number">{stats.daily_stats.used_today}</span>
                                </div>
                            </div>

                            <div className="stat-box">
                                <TrendingUp className="stat-icon animate-bounce-slow" size={32} />
                                <div className="stat-content">
                                    <span className="stat-label">Remaining</span>
                                    <span className="stat-number highlight">{stats.daily_stats.remaining_today}</span>
                                </div>
                            </div>

                            <div className="stat-box full-width">
                                <Clock className="stat-icon animate-pulse-slow" size={32} />
                                <div className="stat-content">
                                    <span className="stat-label">Reset Time</span>
                                    <span className="stat-number">{stats.daily_stats.reset_time}</span>
                                </div>
                            </div>
                        </div>

                        {!stats.daily_stats.can_send_more && (
                            <div className="limit-warning">
                                <AlertTriangle size={20} />
                                Daily limit reached. Please wait until reset time.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {stats && !stats.mongodb_connected && (
                <div className="stats-result">
                    <div className="error-card">
                        <h3>
                            <XCircle className="animate-shake" size={28} />
                            MongoDB Not Connected
                        </h3>
                        <p>Daily tracking is unavailable. Please check backend configuration.</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="stats-result">
                    <div className="error-card">
                        <h3>
                            <XCircle className="animate-shake" size={28} />
                            Error
                        </h3>
                        <p>{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DailyStats;
