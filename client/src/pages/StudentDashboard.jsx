import React from "react";
import { useNavigate } from "react-router-dom";
import './StudentDashboard.css'
import { useState, useEffect } from "react";
export function StudentDashboardNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div id="top-navbar">
      <div id="brand">CampusEventHub</div>

      <div id="nav-links">
        <a id="nav-active" onClick={() => navigate("/student-dashboard")}>
          Dashboard
        </a>

        <a onClick={() => navigate("/student-dashboard/all-events")}>
          All Events
        </a>
      </div>

      <div id="user-box">
        <span>{JSON.parse(localStorage.getItem("user"))?.email || "User"}</span>
        <button id="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
export default function StudentDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then(res => res.json())
      .then(data => setEvents(data));

    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) {
      fetch(`http://localhost:5000/registrations?userId=${user._id}`)
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter(r => r.userId?._id === user._id);
          setRegistrations(filtered);
        });
    }
  }, []);
  React.useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const getStatusForEvent = (eventId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const reg = registrations.find(
      r => r.eventId?._id === eventId && r.userId?._id === user?._id
    );
    return reg ? reg.status : "Unregistered";
  };
  return (
    <div id="dashboard-wrapper">

      {/* MAIN CONTENT */}
      <div id="page-container">
        
        <h1 id="page-title">Student Dashboard</h1>
        <p id="page-sub">Welcome back! Here are your events. </p>

        {/* STAT CARDS */}
        <div id="stats-grid">

          <div id="stat-card">
            <p id="stat-label">Registered Events</p>
            <p id="stat-number">{registrations.length}</p>
          </div>

          <div id="stat-card">
            <p id="stat-label">Approved</p>
            <p id="stat-number">
              {registrations.filter(r => r.status === "Approved").length}
            </p>
          </div>

          <div id="stat-card">
            <p id="stat-label">Pending</p>
            <p id="stat-number">
              {registrations.filter(r => r.status === "Pending").length}
            </p>
          </div>

          <div id="stat-card">
            <p id="stat-label">Rejected</p>
            <p id="stat-number">
              {registrations.filter(r => r.status === "Rejected").length}
            </p>
          </div>

          <div id="stat-card">
            <p id="stat-label">Upcoming Events</p>
            <p id="stat-number">
              {events.filter(e => !e.completed).length}
            </p>
          </div>

          <div id="stat-card">
            <p id="stat-label">Total Events Available</p>
            <p id="stat-number">{events.length}</p>
          </div>

        </div>

      {/* UPCOMING EVENTS */}
        <div id="upcoming-events-title">Upcoming Events</div>
        <div
          id="view-all-btn"
          onClick={() => navigate("/student-dashboard/all-events")}
        >
          View All →
        </div>

        <div id="upcoming-events-container">
          {events.slice(0, 6).map((event) => (
            <div id="event-item" key={event._id}>
              <div id="event-item-split">

                <div id="event-item-image">
                  <img
                    src={event.banner || event.image}
                    alt={event.title}
                    id="event-img"
                  />
                </div>

                <div id="event-item-info">
                  <div id="float-right">
                    <span id="event-category-badge">{event.category}</span>
                    {(() => {
                        const st = getStatusForEvent(event._id);
                        return (
                          <span id="event-status-user" className={`status-${st.toLowerCase()}`}>
                            {st}
                          </span>
                        );
                    })()}
                    
                  </div>
                  <span id="event-item-title">{event.title}</span>
                  <div id="event-item-meta">
                    <p id="event-location-text">{event.location}</p>
                  </div>
                  <div className="btn-cnt"><button
                      id="event-details-btn"
                      onClick={() =>
                        navigate(`/student-dashboard/all-events/event/${event._id}`, {
                          state: { from: "student" }
                        })
                      }
                    >
                      View Details
                    </button></div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}