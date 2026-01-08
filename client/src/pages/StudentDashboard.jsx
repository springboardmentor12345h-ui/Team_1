import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './StudentDashboard.css'
import StudentChatbot from "../components/StudentChatbot";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
export function StudentDashboardNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const [loadingNotifications, setLoadingNotifications] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(
    localStorage.getItem("theme") === "dark"
  );

  const hasUnread = notifications.some(n => n.isRead === false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;

      const res = await fetch(`http://localhost:5000/notifications/${user._id}`);
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;

      await fetch(`http://localhost:5000/notifications/mark-all-read/${user._id}`, {
        method: "PATCH",
      });

      // update local state instantly
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showNotifications]);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;

    fetchNotifications(); // initial fetch

    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000); // 15 seconds polling

    return () => clearInterval(interval);
  }, []);

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

  return (
    <>
      <div id="top-navbar">
        <div className="brandlogo">
          <div className="logo-wrapper1">
            <img
              src={logo}
              alt="CampusEventHub Logo"
              className="dashlogo1"
            />
          </div>
          <div id="brand">CampusEventHub</div></div>

        <div id="nav-links">
          <a
            className={isActive("/student-dashboard") && !isActive("/student-dashboard/all-events") ? "nav-link active" : "nav-link"}
            onClick={() => navigate("/student-dashboard")}
          >
            Dashboard
          </a>

          <a
            className={isActive("/student-dashboard/all-events") ? "nav-link active" : "nav-link"}
            onClick={() => navigate("/student-dashboard/all-events")}
          >
            All Events
          </a>
        </div>

        <div id="user-box">
          <span>{JSON.parse(localStorage.getItem("user"))?.email || "User"}</span>

          <FontAwesomeIcon
            icon={isDarkMode ? faSun : faMoon}
            className="theme-toggle-icon"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          />

          <div className="notification-bell-wrapper">
            <FontAwesomeIcon
              icon={faBell}
              className="notificationicon"
              onClick={() => {
                setShowNotifications(prev => !prev);
                fetchNotifications();
              }}
            />
            {hasUnread && <span className="notification-dot"></span>}
          </div>
          <button id="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      {showNotifications && (
        <div
          className="notification-overlay"
          onClick={() => setShowNotifications(false)}
        >
          <div
            className="notification-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="notification-close"
              onClick={() => setShowNotifications(false)}
            >
              ✕
            </button>
            <h3>Notifications</h3>
            {loadingNotifications && <p>Loading...</p>}

            {!loadingNotifications && notifications.length === 0 && (
              <p>No notifications yet.</p>
            )}

            {!loadingNotifications &&
              notifications.map((n) => (
                <div key={n._id} className={`notification-item ${n.type}`}>
                  <strong>{n.type?.toUpperCase()}</strong>

                  {n.eventId?.title && (
                    <span className="notification-event">
                      {n.eventId.title}
                    </span>
                  )}

                  <p>{n.message}</p>
                  <small>{new Date(n.createdAt).toLocaleString()}</small>
                </div>
              ))
            }
            {notifications.length > 0 && (
              <button
                className="notification-mark-all"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default function StudentDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const eventsRes = await fetch("http://localhost:5000/events");
        if (!eventsRes.ok) throw new Error("Events API down");
        const eventsData = await eventsRes.json();
        setEvents(eventsData);

        const user = JSON.parse(localStorage.getItem("user"));
        if (user?._id) {
          const regRes = await fetch(
            `http://localhost:5000/registrations?userId=${user._id}`
          );
          if (!regRes.ok) throw new Error("Registrations API down");
          const regData = await regRes.json();
          const filtered = regData.filter(
            (r) => r.userId?._id === user._id
          );
          setRegistrations(filtered);
        }

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
  const getStatusForEvent = (eventId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const reg = registrations.find(
      r => r.eventId?._id === eventId && r.userId?._id === user?._id
    );
    return reg ? reg.status : "Unregistered";
  };
  if (loading) {
    return null;
  }

  if (apiError) {
    navigate("/error", { replace: true });
    return null;
  }
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