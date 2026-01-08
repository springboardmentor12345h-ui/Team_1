import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeedbackAnalysis.css";
import Lottie from "lottie-react";
import noresultsAnimation from "../assets/noresults.json";

export default function FeedbackAnalysis() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [sentiment, setSentiment] = useState("Neutral");
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // 1) Load list of events to populate the select box
  const fetchEvents = async () => {
    try {
      // your project earlier used GET /events — if your API is /api/events change this URL
      const res = await fetch("http://localhost:5000/events");
      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      const allEvents = Array.isArray(data) ? data : data.data || [];
      if (user) {
        const myEvents = allEvents.filter(
          (e) => e.createdBy === user._id
        );
        setEvents(myEvents);
      } else {
        setEvents([]);
      }
    } catch (e) {
      console.error("fetchEvents:", e);
      setApiError(true);
    }
  };

  const calculateSentiment = (dist) => {
    const total = dist.reduce((acc, r) => acc + r.count, 0);
    if (!total) return "Neutral";
    const high = dist.filter(r => r.stars >= 3).reduce((a,b)=>a+b.count,0);
    const low  = dist.filter(r => r.stars <= 2).reduce((a,b)=>a+b.count,0);
    if (high / total >= 0.3) return "Positive";
    if (low / total >= 0.6)  return "Negative";
    return "Neutral";
  };

  // 2) Load feedback summary + list for a given eventId
  const loadData = async (id) => {
    if (user && events.length && !events.find(e => (e._id || e.id) === id)) {
      setError("You are not allowed to view feedback for this event");
      return;
    }
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      // Summary — handles various shapes returned by backend
      const s = await fetch(`http://localhost:5000/api/feedback/summary/${id}`);
      const sData = await s.json();

      const avg = Number(sData.averageRating ?? sData.avgRating ?? (sData[0] && (sData[0].avgRating || sData[0].averageRating)) ?? 0);
      const total = Number(sData.totalFeedback ?? sData.total ?? (sData[0] && sData[0].total) ?? 0);

      setAverageRating(isNaN(avg) ? 0 : avg);
      setTotalFeedback(isNaN(total) ? 0 : total);

      // Full feedback list
      const f = await fetch(`http://localhost:5000/api/feedback/event/${id}`);
      const fData = await f.json();
      const list = Array.isArray(fData) ? fData : (fData.data || []);
      setRecentFeedback(list);

      // Distribution (5 → 1)
      const dist = [5,4,3,2,1].map(star => ({
        stars: star,
        count: list.filter(x => Number(x.rating) === star).length
      }));
      setRatingDistribution(dist);
      setSentiment(calculateSentiment(dist));
    } catch (e) {
      console.error("loadData:", e);
      setApiError(true);
    }

    setLoading(false);
  };

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // When selected event changes, load data
  useEffect(() => {
    if (!eventId) return;
    loadData(eventId);
  }, [eventId]);

  if (apiError) {
    navigate("/error", { replace: true });
    return null;
  }

  return (
    <div className="fa-page">
      <div className="fa-inner">
        <h1 className="fa-title">Feedback Analytics</h1>
        <p className="fa-subtitle">Analyze event ratings and comments</p>

        <div style={{ marginTop: 20, display: "flex", alignItems: "center" }} className="int-buttons">
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="fa-input"
            style={{ padding: 10, borderRadius: 6 }}
          >
            <option value="" className="">Select event</option>
            {events.map(ev => (
              <option key={ev._id || ev.id} value={ev._id || ev.id}>
                {ev.title || ev.name || ev.eventName || ev.nameOfEvent || (ev._id || ev.id)}
              </option>
            ))}
          </select>

          <button onClick={() => loadData(eventId)} className="fa-load-btn">Load</button>
          <button onClick={() => loadData(eventId)} className="fa-load-btn">Refresh</button>
        </div>

        <div className="fa-stats-row">
          <div className="fa-card fa-rating-card">
            <h3>Average Rating</h3>
            <div className="fa-rating-value">
              {Number(averageRating) === 0 ? "No rating yet" : Number(averageRating).toFixed(2)}
            </div>
            <p className="fa-rating-based">Based on {totalFeedback} reviews</p>
          </div>

          <div className="fa-card fa-feedback-count">
            <h3>Total Feedback</h3>
            <div className="fa-feedback-value">
              {Number(totalFeedback) === 0 ? "No feedback yet" : totalFeedback}
            </div>
            <p className="fa-feedback-change">Live from DB</p>
          </div>

          <div className="fa-card fa-sentiment-card">
            <h3>Sentiment</h3>
            <div
              className="fa-sentiment-value"
              style={{ color: sentiment === "Positive" ? "#16a34a" : sentiment === "Negative" ? "#dc2626" : "#374151" }}
            >
              {sentiment}
            </div>
            <p className="fa-sentiment-note">Based on rating distribution</p>
          </div>
        </div>

        <div className="fa-middle-row">
          <div className="fa-card fa-distribution-card">
            <h3>Rating Distribution</h3>
            <div className="fa-distribution-list">
              {(eventId && ratingDistribution.length > 0 ? ratingDistribution : [5,4,3,2,1].map(star => ({ stars: star, count: 0 })))
                .map((r) => (
                  <div className="fa-distribution-item" key={r.stars}>
                    <span className="fa-star-label">{r.stars} ★</span>
                    <div className="fa-bar-bg">
                      <div className="fa-bar-fill" style={{ width: `${(r.count || 0) * 20}%` }} />
                    </div>
                    <span className="fa-bar-count">{r.count || 0}</span>
                  </div>
              ))}
            </div>
          </div>

          <div className="fa-card fa-recent-card">
            <h3>Recent Feedback</h3>

            <div className="fa-recent-list">
              {loading && <p>Loading...</p>}

              {!loading && recentFeedback.length === 0 && (
                <div className="fa-no-recent">
                  <Lottie
                    animationData={noresultsAnimation}
                    loop={true}
                    className="svgres"
                  />
                  <p>No feedback yet.</p>
                </div>
              )}

              {recentFeedback.map((f, idx) => (
                <div className="fa-recent-item" key={f._id || idx}>
                  <div className="fa-recent-header">
                    <div className="fa-recent-event">
                      { /* show a friendly event title when present */ }
                      {typeof f.event_id === "object"
                          ? (f.event_id.title || f.event_id.name || f.event_id._id || "Event")
                          : (events.find(e => (e._id || e.id) === f.event_id)?.title
                              || f.event_id
                              || "Event")}
                      <span className="fa-recent-user">
                        by {typeof f.user_id === "object"
                              ? (f.user_id.name || f.user_id.email || f.user_id._id || "User")
                              : f.user_id} on {new Date(f.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="fa-recent-stars">
                      {"★".repeat(Number(f.rating) || 0)}
                      {"☆".repeat(5 - (Number(f.rating) || 0))}
                    </div>
                  </div>

                  <div className="fa-recent-comment">{f.comments}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && <div style={{ marginTop: 12, color: "red" }}>{error}</div>}
      </div>
    </div>
  );
}