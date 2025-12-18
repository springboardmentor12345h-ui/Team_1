import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import './CollegeDashboard.css'
import { useState, useEffect } from "react";
/* this portion is done by praveen kumar */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
/* this section of praveen kumar code is end here */

export function CollegeDashboardNavbar() {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const location = useLocation();
  /* this portion is done by praveen kumar */
  const [menuOpen, setMenuOpen] = useState(false);
  /* this section of praveen kumar code is end here */

  React.useEffect(() => {
    if (location.pathname.includes("/college-dashboard")) setActiveTab("dashboard");
    else if (location.pathname.includes("/all-events")) setActiveTab("events");
    else if (location.pathname.includes("/create-event")) setActiveTab("create");
    else if (location.pathname.includes("/manage-participants")) setActiveTab("manage");
    else if (location.pathname.includes("/feedback")) setActiveTab("feedback");
  }, [location.pathname]);
  const navigate = useNavigate();
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

      {/* Hamburger Menu Icon for Mobile */}
      <div className="hamburger-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </div>
      {/* this section of praveen kumar code is end here */}

      {/* this portion is done by praveen kumar */}
      <div className={`nav-links ${menuOpen ? "nav-links-mobile-open" : ""}`}>
      {/* this section of praveen kumar code is end here */}
        <a
          className={activeTab === "dashboard" ? "nav-link active" : "nav-link"}
          onClick={() => { setActiveTab("dashboard"); navigate("/college-dashboard"); }}
        >
          Dashboard
        </a>
        <a
          className={activeTab === "events" ? "nav-link active" : "nav-link"}
          onClick={() => { setActiveTab("events"); navigate("/all-events"); }}
        >
          All Events
        </a>
        <a
          className={activeTab === "create" ? "nav-link active" : "nav-link"}
          onClick={() => { setActiveTab("create"); navigate("/create-event"); }}
        >
          Create Event
        </a>
        <a
          className={activeTab === "manage" ? "nav-link active" : "nav-link"}
          onClick={() => { setActiveTab("manage"); navigate("/manage-participants"); }}
        >
          Manage Participants
        </a>
        <a
          className={activeTab === "feedback" ? "nav-link active" : "nav-link"}
          onClick={() => { setActiveTab("feedback"); navigate("/feedback"); }}
        >
          Feedback
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
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default function CollegeDashboard() {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then(res => res.json())
      .then(data => setEvents(data));

    fetch("http://localhost:5000/registrations")
      .then(res => res.json())
      .then(data => setRegistrations(data));
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
  return (
    <div className="dashboard-wrapper">

      {/* MAIN CONTENT */}
      <div className="page-container">
        
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-sub">Welcome back, Admin ! Here's your event overview. </p>

        {/* ACTION BUTTONS */}
        <div className="action-buttons">
          <button
            className="purple-btn"
            onClick={() => navigate("/create-event")}
          >
            + Create New Event
          </button>
          <button className="gray-btn" onClick={() => navigate("/manage-participants")}> Manage Participants</button>
          <button className="gray-btn" onClick={() => navigate("/all-events")}> View All Events</button>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Active Events</p>
            <p className="stat-number">{events.filter(e => !e.completed).length}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Total Registrations</p>
            <p className="stat-number">{registrations.length}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Approved</p>
            <p className="stat-number">{registrations.filter(r => r.status === "Approved").length}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Pending Approval</p>
            <p className="stat-number">{registrations.filter(r => r.status === "Pending").length}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Completed Events</p>
            <p className="stat-number">{events.filter(e => e.completed).length}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Total Events</p>
            <p className="stat-number">{events.length}</p>
          </div>
        </div>
        <div className="upcoming-events-title">Upcoming Events</div>
        {/* this portion is done by praveen kumar */}
        <button
          className="view-all-btn"
          onClick={() => navigate("/all-events")}
        >
          View All →
        </button>
        {/* this section of praveen kumar code is end here */}

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
                  <div className="float-right"><span className="event-category-badge">{event.category}</span></div>

                  <span className="event-item-title">{event.title}</span>

                  <div className="event-item-meta">
                    <p className="event-date-text">{event.date}</p>
                    <p className="event-location-text">{event.location}</p>
                    <p className="event-capacity-text">{event.registered} {event.capacity}</p>
                  </div>
                  <div className="event-actions-row">
                    <button
                      className="event-details-btn"
                      onClick={() =>
                        navigate(`/all-events/event/${event._id}`, {
                          state: { from: "college" },
                        })
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}