import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageParticipants.css";
import Lottie from "lottie-react";
import noresultsAnimation from "../assets/noresults.json";

export default function ManageParticipants() {
    const [search, setSearch] = useState("");
    const [eventFilter, setEventFilter] = useState("ALL");

    const [participants, setParticipants] = useState([]);
    const [events, setEvents] = useState([]);

    const [apiError, setApiError] = useState(false);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const regRes = await fetch("http://localhost:5000/registrations");
                if (!regRes.ok) throw new Error("Registrations API down");
                const data = await regRes.json();

                if (user) {
                    const ownEventRegistrations = data.filter(
                        (r) => r.eventId?.createdBy === user._id
                    );
                    setParticipants(ownEventRegistrations);
                } else {
                    setParticipants([]);
                }

                const eventsRes = await fetch("http://localhost:5000/events");
                if (!eventsRes.ok) throw new Error("Events API down");
                const eventsData = await eventsRes.json();

                if (user) {
                    const ownEvents = eventsData.filter(
                        (e) => e.createdBy === user._id
                    );
                    setEvents(ownEvents);
                } else {
                    setEvents([]);
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

    const handleApprove = async (id) => {
        try {
            await fetch(`http://localhost:5000/registrations/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user?._id
                },
                body: JSON.stringify({ status: "Approved" }),
            });
            // refresh list
            try {
                const res = await fetch("http://localhost:5000/registrations");
                if (!res.ok) throw new Error("Registrations API down");
                const data = await res.json();
                if (user) {
                    const ownEventRegistrations = data.filter(
                        (r) => r.eventId?.createdBy === user._id
                    );
                    setParticipants(ownEventRegistrations);
                } else {
                    setParticipants([]);
                }
            } catch (err) {
                console.error(err);
                setApiError(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async (id) => {
        try {
            await fetch(`http://localhost:5000/registrations/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user?._id
                },
                body: JSON.stringify({ status: "Rejected" }),
            });
            // refresh list
            try {
                const res = await fetch("http://localhost:5000/registrations");
                if (!res.ok) throw new Error("Registrations API down");
                const data = await res.json();
                if (user) {
                    const ownEventRegistrations = data.filter(
                        (r) => r.eventId?.createdBy === user._id
                    );
                    setParticipants(ownEventRegistrations);
                } else {
                    setParticipants([]);
                }
            } catch (err) {
                console.error(err);
                setApiError(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredParticipants = participants.filter((p) => {
      // EVENT FILTER
      if (eventFilter !== "ALL" && p.eventId?._id !== eventFilter) {
        return false;
      }

      // SEARCH FILTER
      const searchValue = search.trim().toLowerCase();
      if (!searchValue) return true;

      const name =
        p.userId?.name?.toLowerCase() ||
        p.userId?.username?.toLowerCase() ||
        "";

      const email = p.userId?.email?.toLowerCase() || "";

      return name.includes(searchValue) || email.includes(searchValue);
    });

    if (loading) {
        return <div style={{ padding: "40px" }}>Loading...</div>;
    }

    if (apiError) {
        navigate("/error", { replace: true });
        return null;
    }

    return (
        <div className="mp-page">
            <div className="mp-inner">
                {/* Title */}
                <h1 className="mp-title">Participant Management</h1>
                <p className="mp-subtitle">
                    Manage registrations of all students here
                </p>

                {/* Filters Section */}
                <div className="mp-filters-row">
                    <select
                        className="mp-filter-select"
                        value={eventFilter}
                        onChange={(e) => setEventFilter(e.target.value)}
                    >
                        <option value="ALL">All Events</option>
                        {events.map((e) => (
                            <option key={e._id} value={e._id}>
                                {e.title}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        className="mp-search"
                        placeholder="Search student email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        className="mp-export-btn"
                        onClick={() => window.location.reload()}
                    >
                        Refresh
                    </button>
                </div>

                {/* Table */}
                <table className="mp-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Event</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredParticipants.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="mp-no-results">
                                    <Lottie
                                        animationData={noresultsAnimation}
                                        loop={true}
                                        className="svgres"
                                    />
                                </td>
                            </tr>
                        ) : (
                            filteredParticipants.map((p) => (
                                <tr key={p._id}>
                                    <td>
                                        <div className="mp-student-name">{p.userId?.name}</div>
                                        <div className="mp-student-email">{p.userId?.email}</div>
                                    </td>

                                    <td>{p.eventId?.title}</td>
                                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>

                                    <td>
                                        <span className={`mp-status mp-status-${p.status.toLowerCase()}`}>
                                            {p.status}
                                        </span>
                                    </td>

                                    <td>
                                        {p.status === "Pending" && user && p.eventId?.createdBy === user._id && (
                                            <div className="mp-actions">
                                                <button className="mp-approve-btn" onClick={() => handleApprove(p._id)}>✓</button>
                                                <button className="mp-reject-btn" onClick={() => handleReject(p._id)}>✕</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}