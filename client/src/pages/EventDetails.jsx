import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./EventDetails.css";
import axios from "axios";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromStudent = location.state?.from === "student";

  const [event, setEvent] = useState(null);
  const [canDelete, setCanDelete] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [regStatus, setRegStatus] = useState(null);
const [hasFeedback, setHasFeedback] = useState(false);
const [apiError, setApiError] = useState(false);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadDetails = async () => {
    try {
      setLoading(true);

      const eventRes = await fetch(`http://localhost:5000/events/${id}`);
      if (!eventRes.ok) throw new Error("Event API down");
      const data = await eventRes.json();
      setEvent(data);

      const user = JSON.parse(localStorage.getItem("user"));
      if (user && data.createdBy && data.createdBy === user._id) {
        setCanDelete(true);
      } else {
        setCanDelete(false);
      }

      if (user) {
        const regRes = await fetch(`http://localhost:5000/registrations`);
        if (!regRes.ok) throw new Error("Registrations API down");
        const all = await regRes.json();
        const match = all.find(
          r => r.userId?._id === user._id && r.eventId?._id === id
        );
        if (match) setRegStatus(match.status);

        const fbRes = await fetch(
          `http://localhost:5000/api/feedback/event/${id}`
        );
        if (!fbRes.ok) throw new Error("Feedback API down");
        const list = await fbRes.json();
        const fbList = Array.isArray(list) ? list : list.data || [];
        const exists = fbList.some(
          fb => fb.user_id === user._id || fb.user_id?._id === user._id
        );
        setHasFeedback(exists);
      }

      setApiError(false);
    } catch (err) {
      console.error("Backend not reachable", err);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  loadDetails();
}, [id]);

if (loading) {
  return (
    <div className="ed-page">
      <div className="ed-inner">
        <div className="ed-card ed-empty-card">
          <h2>Loading...</h2>
        </div>
      </div>
    </div>
  );
}

if (apiError) {
  navigate("/error", { replace: true });
  return null;
}

  const start = new Date(event.start_date);
  const end = new Date(event.end_date);

  const dateString = start.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const startTime = start.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });

  const endTime = end.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });

  const progress =
    (event.registered_count / event.max_participants) * 100;

  const handleDelete = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Unauthorized");
      return;
    }

    const res = await fetch(`http://localhost:5000/events/${id}`, {
      method: "DELETE",
      headers: {
        "x-user-id": user._id
      }
    });

    if (!res.ok) {
      alert("Failed to delete event");
      return;
    }

    navigate("/all-events");
  };

  const handleRegister = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please login first.");
        return;
      }

      const res = await fetch("http://localhost:5000/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          userId: user._id
        })
      });

      if (res.status === 409) {
        alert("You have already registered for this event.");
        return;
      }

      if (!res.ok) {
        alert("Registration failed.");
        return;
      }

      alert("Registration successful!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Error registering.");
    }
  };

  const submitFeedback = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please login first.");
        return;
      }

      const payload = {
        event_id: event._id,
        user_id: user._id,
        rating: rating,
        comments: comment
      };

      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Failed to submit feedback");
        return;
      }

      alert("Feedback submitted");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Server error submitting feedback");
    }
  };

  return (
    <div className="ed-page">
      <div className="ed-inner">
        {/* Top back link */}
        <div className="ed-top-buttons">
          <button className="ed-back-link" onClick={() => navigate(-1)}>
            ← Back to All Events
          </button>

          {!fromStudent && canDelete && (
            <button
              className="ed-delete-btn"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Event
            </button>
          )}
          {fromStudent && (
            regStatus ? (
              <span
                className={`ed-status-btn status-${regStatus.toLowerCase()}`}
              >
                {regStatus}
              </span>
            ) : (
              <button
                className="ed-register-btn"
                onClick={handleRegister}
              >
                Register Now
              </button>
            )
          )}
        </div>

        {/* Hero card */}
        <div className="ed-hero-card">
          <div className="ed-hero-image-wrapper">
            <img
              src={event.image}
              alt={event.title}
              className="ed-hero-image"
            />
            <div className="ed-hero-overlay">
              <span className="ed-hero-badge">{event.category}</span>
              <h1 className="ed-hero-title">{event.title}</h1>
              <div className="ed-hero-meta">
                <span>{dateString}</span>
                <span className="ed-dot">•</span>
                <span>{startTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-column layout */}
        <div className="ed-layout">
          {/* Left column */}
          <div className="ed-main-column">
            <section className="ed-card">
              <h2 className="ed-section-title">About This Event</h2>
              <p className="ed-text">{event.description}</p>
            </section>

            <section className="ed-card">
              <h2 className="ed-section-title">Requirements</h2>
              <p className="ed-text">{event.requirements}</p>
            </section>

            <section className="ed-card">
              <h2 className="ed-section-title">Tags</h2>
              <div className="ed-tags">
                {event.tags.map((tag, index) => (
                  <span key={index} className="ed-tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Right column (sidebar) */}
          <aside className="ed-side-column">
            <section className="ed-card">
              <h3 className="ed-subtitle">Location</h3>
              <p className="ed-text-small">{event.location}</p>
            </section>

            <section className="ed-card">
              <h3 className="ed-subtitle">Date &amp; Time</h3>
              <p className="ed-text-small">{dateString}</p>
              <p className="ed-text-small">
                {startTime} – {endTime}
              </p>
            </section>

            <section className="ed-card">
              <h3 className="ed-subtitle">Participants</h3>
              <p className="ed-text-small">
                {event.registered_count} / {event.max_participants} registered
              </p>
              <div className="ed-progress">
                <div
                  className="ed-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </section>
            {fromStudent && regStatus === "Approved" && (
              hasFeedback ? (
                <button
                  className="ed-feedback-btn"
                  style={{ backgroundColor: "#999", cursor: "not-allowed" }}
                  disabled
                >
                  Feedback Submitted
                </button>
              ) : (
                <button
                  className="ed-feedback-btn"
                  onClick={() => setShowFeedback(true)}
                >
                  Leave Feedback
                </button>
              )
            )}
          </aside>
        </div>
        {showDeleteModal && (
          <div className="ed-modal-overlay">
            <div className="ed-modal">
              <h3>Delete This Event?</h3>
              <p>This action cannot be undone.</p>

              <div className="ed-modal-actions">
                <button
                  className="ed-cancel-btn"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="ed-confirm-delete-btn"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {showFeedback && (
          <div className="ed-modal-overlay">
            <div className="ed-modal">
              <h3>Leave a Feedback</h3>

              <div className="ed-stars-row">
                {[1,2,3,4,5].map(num => (
                  <span
                    key={num}
                    className={num <= rating ? "ed-star active" : "ed-star"}
                    onClick={() => setRating(num)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                className="ed-feedback-input"
                placeholder="Write your comments..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="ed-modal-actions">
                <button
                  className="ed-cancel-btn"
                  onClick={() => setShowFeedback(false)}
                >
                  Cancel
                </button>

                <button
                  className="ed-confirm-delete-btn"
                  disabled={rating === 0 || comment.trim() === ""}
                  onClick={submitFeedback}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;