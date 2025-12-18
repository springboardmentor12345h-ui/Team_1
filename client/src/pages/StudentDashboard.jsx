import React from "react";
import { useNavigate } from "react-router-dom";
import './StudentDashboard.css'
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* this portion is done by praveen kumar */
import { faBell, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'; /* edited by praveen kumar */
/* this section of praveen kumar code is end here */
export function StudentDashboardNavbar() {
  const navigate = useNavigate();
  /* this portion is done by praveen kumar */
  const [menuOpen, setMenuOpen] = useState(false);
  /* this section of praveen kumar code is end here */

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="top-navbar">
      {/* this portion is done by praveen kumar */}
      <div className="brand">
        <img src="/Logo.png" alt="Logo" className="brand-logo" />
        CampusEventHub
      </div>
      {/* this section of praveen kumar code is end here */}

      {/* this portion is done by praveen kumar */}
      {/* Mobile Icons - Notification and Hamburger Menu */}
      <div className="mobile-icons">
        <FontAwesomeIcon icon={faBell} className="notificationicon mobile-notification" />
        <div className="hamburger-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </div>
      </div>
      {/* this section of praveen kumar code is end here */}

      {/* this portion is done by praveen kumar */}
      <div className={`nav-links ${menuOpen ? "nav-links-mobile-open" : ""}`}>
      {/* this section of praveen kumar code is end here */}
        <a className="nav-active" onClick={() => navigate("/student-dashboard")}>
          Dashboard
        </a>

        <a onClick={() => navigate("/student-dashboard/all-events")}>
          All Events
        </a>
        
        {/* this portion is done by praveen kumar */}
        {/* Logout option for mobile menu */}
        <a className="mobile-logout" onClick={handleLogout}>
          Logout
        </a>
        {/* this section of praveen kumar code is end here */}
      </div>

      <div className="user-box">
        <span>{JSON.parse(localStorage.getItem("user"))?.email || "User"}</span>
        <FontAwesomeIcon icon={faBell} className="notificationicon" />
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
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
    <div className="dashboard-wrapper">

      {/* MAIN CONTENT */}
      <div className="page-container">
        
        <h1 className="page-title">Student Dashboard</h1>
        <p className="page-sub">Welcome back! Here are your events. </p>

        {/* STAT CARDS */}
        <div className="stats-grid">

          <div className="stat-card">
            <p className="stat-label">Registered Events</p>
            <p className="stat-number">{registrations.length}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Approved</p>
            <p className="stat-number">
              {registrations.filter(r => r.status === "Approved").length}
            </p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Pending</p>
            <p className="stat-number">
              {registrations.filter(r => r.status === "Pending").length}
            </p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Rejected</p>
            <p className="stat-number">
              {registrations.filter(r => r.status === "Rejected").length}
            </p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Upcoming Events</p>
            <p className="stat-number">
              {events.filter(e => !e.completed).length}
            </p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Total Events Available</p>
            <p className="stat-number">{events.length}</p>
          </div>

        </div>

      {/* UPCOMING EVENTS */}
        <div className="upcoming-events-title">Upcoming Events</div>
        <div
          className="view-all-btn"
          onClick={() => navigate("/student-dashboard/all-events")}
        >
          View All →
        </div>

        <div className="upcoming-events-container">
          {events.slice(0, 6).map((event) => (
            <div className="event-item" key={event._id}>
              <div className="event-item-split">

                <div className="event-item-image">
                  <img
                    src={event.banner || event.image}
                    alt={event.title}
                    className="event-img"
                  />
                </div>

                <div className="event-item-info">
                  <div className="float-right">
                    <span className="event-category-badge">{event.category}</span>
                    {(() => {
                        const st = getStatusForEvent(event._id);
                        return (
                          <span className={`event-status-user status-${st.toLowerCase()}`}>
                            {st}
                          </span>
                        );
                    })()}
                    
                  </div>
                  <span className="event-item-title">{event.title}</span>
                  <div className="event-item-meta">
                    <p className="event-location-text">{event.location}</p>
                  </div>
                  <div className="btn-cnt"><button
                      className="event-details-btn"
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