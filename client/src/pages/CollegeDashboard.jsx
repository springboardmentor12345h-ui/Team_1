import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import './CollegeDashboard.css'
import logo from "/logo.png";

export function CollegeDashboardNavbar({
  myEvents = [],
  approvedCount = 0,
  pendingCount = 0,
  myRegistrations = []
}) {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  const [isDarkMode, setIsDarkMode] = React.useState(
    localStorage.getItem("theme") === "dark"
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark-mode");
    setIsDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark-mode");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark-mode");
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="top-navbar">
        <div className="brandlogo">
          <div className="logo-wrapper1">
            <img
              src={logo}
              alt="CampusEventHub Logo"
              className="dashlogo1"
            />
          </div>
          <div id="brand">CampusEventHub</div></div>

        <div
          className="hamburger-icon"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </div>

        <div className={`nav-links ${menuOpen ? "nav-links-mobile-open" : ""}`}>
          <a
            className={isActive("/college-dashboard") ? "nav-link active" : "nav-link"}
            onClick={() => {
              setMenuOpen(false);
              navigate("/college-dashboard");
            }}
          >
            Dashboard
          </a>
          <a
            className={isActive("/all-events") ? "nav-link active" : "nav-link"}
            onClick={() => {
              setMenuOpen(false);
              navigate("/all-events");
            }}
          >
            All Events
          </a>
          <a
            className={isActive("/create-event") ? "nav-link active" : "nav-link"}
            onClick={() => {
              setMenuOpen(false);
              navigate("/create-event");
            }}
          >
            Create Event
          </a>
          <a
            className={isActive("/manage-participants") ? "nav-link active" : "nav-link"}
            onClick={() => {
              setMenuOpen(false);
              navigate("/manage-participants");
            }}
          >
            Manage Participants
          </a>
          <a
            className={isActive("/feedback") ? "nav-link active" : "nav-link"}
            onClick={() => {
              setMenuOpen(false);
              navigate("/feedback");
            }}
          >
            Feedback
          </a>
          <a
            className="mobile-logout"
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
          >
            Logout
          </a>
        </div>

        <div className="user-box">
          <span>{JSON.parse(localStorage.getItem("user"))?.email || "User"}</span>
          <FontAwesomeIcon
            icon={isDarkMode ? faSun : faMoon}
            className="theme-toggle-icon"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          />
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  );
}

export default function CollegeDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const eventsRes = await fetch("http://localhost:5000/events");
        if (!eventsRes.ok) throw new Error("Events API down");
        const eventsData = await eventsRes.json();
        setEvents(eventsData);

        const regRes = await fetch("http://localhost:5000/registrations");
        if (!regRes.ok) throw new Error("Registrations API down");
        const regData = await regRes.json();
        setRegistrations(regData);

        setApiError(false);
      } catch (err) {
        console.error("Backend not reachable", err);
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  if (loading) {
    return null;
  }

  if (apiError) {
    navigate("/error", { replace: true });
    return null;
  }

  const myEvents = user
    ? events.filter(e => e.createdBy === user._id)
    : [];

  const myEventIds = myEvents.map(e => e._id);

  const myRegistrations = registrations.filter(r => {
    if (!r.eventId) return false;

    const eventId =
      typeof r.eventId === "string"
        ? r.eventId
        : r.eventId._id;

    return myEventIds.includes(eventId);
  });

  const approvedCount = myRegistrations.filter(
    r => r.status?.toLowerCase() === "approved"
  ).length;

  const pendingCount = myRegistrations.filter(
    r => r.status?.toLowerCase() === "pending"
  ).length;

  const isDark = document.documentElement.classList.contains("dark-mode");



  const chatbotStats = {
    total: myEvents.length,
    approvedParticipants: approvedCount,
    pendingParticipants: pendingCount,
    rejectedParticipants: myRegistrations.filter(
      r => r.status?.toLowerCase() === "rejected"
    ).length
  };

  return (
    <div className={`dashboard-wrapper ${isDark ? "dark" : ""}`}>
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
            <p className="stat-number">{myRegistrations.length}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Approved</p>
            <p className="stat-number">{approvedCount}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Pending Approval</p>
            <p className="stat-number">{pendingCount}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Completed Events</p>
            <p className="stat-number">{events.filter(e => e.completed).length}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">My Events</p>
            <p className="stat-number">{myEvents.length}</p>
          </div>
        </div>
        <div className="upcoming-events-title">Upcoming Events</div>
        <div
          className="view-all-btn purple-btn"
          onClick={() => navigate("/all-events")}
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