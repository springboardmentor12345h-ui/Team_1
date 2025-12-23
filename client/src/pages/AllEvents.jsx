import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import noresultsAnimation from "../assets/noresults.json";
import './AllEvents.css'
export default function AllEvents() {
    const navigate = useNavigate();
    const location = useLocation();
    const isStudentPath = location.pathname.includes("/student-dashboard");
    const detailsBase = isStudentPath
        ? "/student-dashboard/all-events/event"
        : "/all-events/event";
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All Types");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [apiError, setApiError] = useState(false);

    useEffect(() => {
      let mounted = true;

      const loadEvents = async () => {
        try {
          setLoading(true);

          const res = await fetch("http://localhost:5000/events");
          if (!res.ok) throw new Error("Events API down");

          const data = await res.json();
          if (!mounted) return;

          setEvents(Array.isArray(data) ? data : []);
          setApiError(false);
        } catch (err) {
          console.error("Backend not reachable", err);
          if (mounted) {
            setApiError(true);
            setEvents([]);
          }
        } finally {
          mounted && setLoading(false);
        }
      };

      loadEvents();
      return () => {
        mounted = false;
      };
    }, []);

    if (apiError) {
      navigate("/error", { replace: true });
      return null;
    }

    const categories = useMemo(() => {
        const set = new Set();
        events.forEach((e) => e.category && set.add(e.category));
        return ["All Types", ...Array.from(set)];
    }, [events]);

    const statuses = useMemo(() => {
        const set = new Set();
        events.forEach((e) => e.status && set.add(e.status));
        return ["All Status", ...Array.from(set)];
    }, [events]);

    const filteredEvents = useMemo(() => {
        return events.filter((ev) => {
            if (categoryFilter !== "All Types" && ev.category !== categoryFilter) return false;
            if (statusFilter !== "All Status" && ev.status !== statusFilter) return false;

            if (startDate && new Date(ev.start_date) < new Date(startDate)) return false;
            if (endDate && new Date(ev.start_date) > new Date(endDate)) return false;

            if (search.trim()) {
                const q = search.toLowerCase();
                const title = (ev.title || "").toLowerCase();
                const desc = (ev.description || ev.desc || "").toLowerCase();
                if (!title.includes(q) && !desc.includes(q)) return false;
            }
            return true;
        });
    }, [events, categoryFilter, statusFilter, search, startDate, endDate]);

    const clearFilters = () => {
        setCategoryFilter("All Types");
        setStatusFilter("All Status");
        setSearch("");
        setStartDate("");
        setEndDate("");
    };

    return (
        <div className="ae-page">
            <div className="ae-wrapper">
                <div className="ae-header">
                    <h1 className="ae-title">All Events</h1>
                    <p className="ae-subtitle">Discover and register for exciting inter-college events</p>
                </div>
                <div className="ae-layout">

                    {/* FILTERS */}
                    <aside className="ae-filters">
                        <div className="ae-filter-card">

                            <h3 className="ae-filter-heading">Filters</h3>

                            <div className="ae-filter-row">
                                <div className="ae-filter-group">
                                    <label className="ae-filter-label">Event Type</label>
                                    <select
                                        className="ae-select"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        {categories.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="ae-filter-group">
                                    <label className="ae-filter-label">Status</label>
                                    <select
                                        className="ae-select"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        {statuses.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="ae-filter-group date">
                                <label className="ae-filter-label">Date Range</label>

                                <div className="ae-date-wrapper">
                                    <input
                                        id="startDateInput"
                                        type="date"
                                        className="ae-select ae-date-input"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <svg
                                        className="ae-date-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        fill="black"
                                        onClick={() => document.getElementById("startDateInput").showPicker()}
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v1H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM0 5h16v9a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5zm4 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                    </svg>
                                </div>

                                <div className="ae-date-wrapper">
                                    <input
                                        id="endDateInput"
                                        type="date"
                                        className="ae-select ae-date-input"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                    <svg
                                        className="ae-date-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        fill="black"
                                        onClick={() => document.getElementById("endDateInput").showPicker()}
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v1H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM0 5h16v9a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5zm4 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                    </svg>
                                </div>
                            </div>

                            <button className="ae-clear-btn" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
                    </aside>

                    {/* EVENT LIST */}
                    <main className="ae-content">
                        <div className="ae-count-row">
                            <div className="ae-count" onClick={clearFilters}>
                                Showing {filteredEvents.length} events
                            </div>
                        </div>
                        <div className="ae-search-row">
                            <input
                                aria-label="search"
                                className="ae-search-input"
                                placeholder="Search events by title or description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {loading ? (
                            <div className="ae-loading">Loading events...</div>
                        ) : filteredEvents.length === 0 ? (
                            <div className="ae-no-results">
                                <Lottie
                                    animationData={noresultsAnimation}
                                    loop={true}
                                    className="svgres"
                                />
                            </div>
                        ) : (
                            <div className="ae-grid">
                                {filteredEvents.map((event) => (
                                    <article key={event._id} className="ae-card">

                                        <div className="ae-card-img-wrapper">
                                            <img
                                                className="ae-card-img"
                                                src={
                                                    event.image ||
                                                    event.banner ||
                                                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"
                                                }
                                                alt={event.title}
                                            />

                                            {event.status && (
                                                <span className="ae-status-badge">{event.status}</span>
                                            )}
                                        </div>

                                        <div className="ae-card-body">

                                            {event.category && (
                                                <span className="ae-category-badge">{event.category}</span>
                                            )}

                                            <h3 className="ae-event-title">{event.title}</h3>

                                            <p className="ae-event-desc">
                                                {(event.description || event.desc || "").slice(0, 150)}
                                                {(event.description || event.desc || "").length > 150 ? "..." : ""}
                                            </p>

                                            <div className="ae-meta-row">
                                                <span className="ae-meta-item">
                                                    {(event.start_date ? event.start_date.split("T")[0] : "N/A")}
                                                </span>
                                                <span className="ae-meta-item">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="11"
                                                        height="14"
                                                        fill="currentColor"
                                                        viewBox="0 0 16 16"
                                                        style={{ marginRight: "1px" }}
                                                    >
                                                        <path d="M8 0a5.53 5.53 0 0 0-5.5 5.5c0 3.038 2.757 6.22 4.362 7.97.62.676 1.656.676 2.276 0C10.743 11.72 13.5 8.538 13.5 5.5A5.53 5.53 0 0 0 8 0zm0 7.5A2 2 0 1 1 8 3.5a2 2 0 0 1 0 4z" />
                                                    </svg>
                                                    {event.location || "TBA"}
                                                </span>
                                                <span className="ae-meta-item ae-meta-right">
                                                    {event.registered_count || 0} participating
                                                </span>
                                            </div>

                                            <button
                                                className="ae-details-btn"
                                                onClick={() =>
                                                    navigate(`${detailsBase}/${event._id}`, {
                                                        state: { from: isStudentPath ? "student" : "college" }
                                                    })
                                                }
                                            >
                                                View Details
                                            </button>

                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
}