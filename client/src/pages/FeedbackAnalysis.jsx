import React from "react";
import "./FeedbackAnalysis.css";
export default function FeedbackAnalysis() {
    const averageRating = 4.0;
    const totalFeedback = 3;
    const sentiment = "Positive";

    const ratingDistribution = [
        { stars: 5, count: 1 },
        { stars: 4, count: 1 },
        { stars: 3, count: 1 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
    ];

    const recentFeedback = [
        {
            event: "TechNova 2024",
            user: "Alice Johnson",
            date: "2024-10-16",
            comment: "“Best hackathon ever! Learned so much.”",
            rating: 5,
        },
        {
            event: "TechNova 2024",
            user: "Bob Williams",
            date: "2024-10-16",
            comment: "“Good content but the venue was too hot.”",
            rating: 3,
        },
        {
            event: "Winter Gala",
            user: "Charlie Brown",
            date: "2024-12-20",
            comment: "“Loved the music selection.”",
            rating: 4,
        },
    ];

    return (
        <div className="fa-page">
            <div className="fa-inner">
                <h1 className="fa-title">Feedback Analytics</h1>
                <p className="fa-subtitle">Analyze event ratings and comments</p>

                {/* Top Stats Row */}
                <div className="fa-stats-row">

                    {/* Average Rating */}
                    <div className="fa-card fa-rating-card">
                        <h3>Average Rating</h3>
                        <div className="fa-rating-value">{averageRating}</div>
                        <p className="fa-rating-based">Based on {totalFeedback} reviews</p>
                    </div>

                    {/* Total Feedback */}
                    <div className="fa-card fa-feedback-count">
                        <h3>Total Feedback</h3>
                        <div className="fa-feedback-value">{totalFeedback}</div>
                        <p className="fa-feedback-change">+2 from last week</p>
                    </div>

                    {/* Sentiment */}
                    <div className="fa-card fa-sentiment-card">
                        <h3>Sentiment</h3>
                        <div className="fa-sentiment-value">{sentiment}</div>
                        <p className="fa-sentiment-note">Most reviews are 4+ stars</p>
                    </div>
                </div>

                {/* Middle Row */}
                <div className="fa-middle-row">

                    {/* Rating Distribution */}
                    <div className="fa-card fa-distribution-card">
                        <h3>Rating Distribution</h3>

                        <div className="fa-distribution-list">
                            {ratingDistribution.map((r) => (
                                <div className="fa-distribution-item" key={r.stars}>
                                    <span className="fa-star-label">{r.stars} ★</span>
                                    <div className="fa-bar-bg">
                                        <div
                                            className="fa-bar-fill"
                                            style={{ width: `${r.count * 25}%` }}
                                        ></div>
                                    </div>
                                    <span className="fa-bar-count">{r.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Feedback */}
                    <div className="fa-card fa-recent-card">
                        <h3>Recent Feedback</h3>

                        <div className="fa-recent-list">
                            {recentFeedback.map((f, idx) => (
                                <div className="fa-recent-item" key={idx}>
                                    <div className="fa-recent-header">
                                        <div className="fa-recent-event">
                                            {f.event}
                                            <span className="fa-recent-user">
                                                by {f.user} on {f.date}
                                            </span>
                                        </div>

                                        <div className="fa-recent-stars">
                                            {"★".repeat(f.rating)}
                                            {"☆".repeat(5 - f.rating)}
                                        </div>
                                    </div>

                                    <div className="fa-recent-comment">{f.comment}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}