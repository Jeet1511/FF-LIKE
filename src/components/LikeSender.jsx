import React, { useState } from 'react';
import { apiService } from '../services/api';
import {
    Gamepad2,
    User,
    Globe,
    Heart,
    Send,
    Loader2,
    CheckCircle2,
    XCircle,
    TrendingUp,
    BarChart3
} from 'lucide-react';
import './LikeSender.css';
import './IconAnimations.css';

function LikeSender() {
    const [uid, setUid] = useState('');
    const [server, setServer] = useState('IND');
    const [likeCount, setLikeCount] = useState(10);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await apiService.sendLikes(uid, server, likeCount);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send likes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const parseEmoji = (text) => {
        if (typeof text === 'string') {
            return text.replace(/[📊📈✅🎯🚀⏰🔄🕓🔑📨🌅]/g, '').trim();
        }
        return text;
    };

    return (
        <div className="like-sender">
            <div className="like-sender-header">
                <h1>
                    <Gamepad2 className="header-icon animate-bounce-slow" size={48} />
                    Send Free Fire Likes
                </h1>
                <p>Boost your profile with instant likes</p>
            </div>

            <form onSubmit={handleSubmit} className="like-form">
                <div className="form-group">
                    <label htmlFor="uid">
                        <User className="label-icon animate-pulse-slow" size={20} />
                        User ID (UID)
                    </label>
                    <input
                        id="uid"
                        type="text"
                        value={uid}
                        onChange={(e) => setUid(e.target.value)}
                        placeholder="Enter Free Fire UID"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="server">
                        <Globe className="label-icon animate-spin-slow" size={20} />
                        Server Region
                    </label>
                    <select
                        id="server"
                        value={server}
                        onChange={(e) => setServer(e.target.value)}
                        disabled={loading}
                    >
                        <option value="IND">🇮🇳 India (IND)</option>
                        <option value="BR">🇧🇷 Brazil (BR)</option>
                        <option value="US">🇺🇸 USA (US)</option>
                        <option value="BD">🇧🇩 Bangladesh (BD)</option>
                        <option value="SAC">🌎 South America (SAC)</option>
                        <option value="NA">🌎 North America (NA)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="likeCount">
                        <Heart className="label-icon animate-heartbeat" size={20} />
                        Like Count (1-100)
                    </label>
                    <input
                        id="likeCount"
                        type="number"
                        value={likeCount}
                        onChange={(e) => setLikeCount(e.target.value)}
                        min="1"
                        max="100"
                        required
                        disabled={loading}
                    />
                    <div className="range-indicator">
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={likeCount}
                            onChange={(e) => setLikeCount(e.target.value)}
                            disabled={loading}
                        />
                        <span className="range-value">{likeCount}</span>
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Sending Likes...
                        </>
                    ) : (
                        <>
                            <Send className="btn-icon" size={20} />
                            Send Likes
                        </>
                    )}
                </button>
            </form>

            {result && result.status === 1 && (
                <div className="result-card success-card">
                    <div className="result-header">
                        <h3>
                            <CheckCircle2 className="animate-scale-in" size={28} />
                            Success!
                        </h3>
                        <span className="status-badge success">Completed</span>
                    </div>

                    <div className="player-info">
                        <h4>
                            <User size={20} />
                            Player Information
                        </h4>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Name</span>
                                <span className="info-value">{result.player_info.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">UID</span>
                                <span className="info-value">{result.player_info.uid}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Server</span>
                                <span className="info-value">{result.player_info.server}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Level</span>
                                <span className="info-value">{result.player_info.level}</span>
                            </div>
                        </div>
                    </div>

                    <div className="analytics">
                        <h4>
                            <BarChart3 className="animate-pulse-slow" size={20} />
                            Like Analytics
                        </h4>
                        <div className="analytics-grid">
                            <div className="analytics-item">
                                <span className="analytics-label">Before</span>
                                <span className="analytics-value">{parseEmoji(result.Like_analytics.before)}</span>
                            </div>
                            <div className="analytics-item">
                                <span className="analytics-label">After</span>
                                <span className="analytics-value highlight">{parseEmoji(result.Like_analytics.after)}</span>
                            </div>
                            <div className="analytics-item">
                                <span className="analytics-label">Added</span>
                                <span className="analytics-value success">{parseEmoji(result.Like_analytics.added)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="management">
                        <h4>
                            <TrendingUp className="animate-bounce-slow" size={20} />
                            Daily Management
                        </h4>
                        <div className="progress-container">
                            <div className="progress-info">
                                <span>Used Today: {parseEmoji(result.Management.used_today)}</span>
                                <span>Remaining: {parseEmoji(result.Management.remaining_today)}</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${(parseEmoji(result.Management.used_today) / 100) * 100}%`
                                    }}
                                ></div>
                            </div>
                            <div className="reset-time">
                                Reset Time: {parseEmoji(result.Management.reset_time)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="result-card error-card">
                    <div className="result-header">
                        <h3>
                            <XCircle className="animate-shake" size={28} />
                            Error
                        </h3>
                        <span className="status-badge error">Failed</span>
                    </div>
                    <p className="error-message">{error}</p>
                </div>
            )}
        </div>
    );
}

export default LikeSender;
