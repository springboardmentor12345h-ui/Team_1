import React, { useState, useEffect } from "react";
import "./ManageParticipants.css";

export default function ManageParticipants() {
    const [search, setSearch] = useState("");
    const [eventFilter, setEventFilter] = useState("All Events");

    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/registrations")
            .then((res) => res.json())
            .then((data) => setParticipants(data))
            .catch((err) => console.error(err));
    }, []);

    const handleApprove = async (id) => {
        try {
            await fetch(`http://localhost:5000/registrations/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Approved" }),
            });
            // refresh list
            const res = await fetch("http://localhost:5000/registrations");
            const data = await res.json();
            setParticipants(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async (id) => {
        try {
            await fetch(`http://localhost:5000/registrations/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Rejected" }),
            });
            // refresh list
            const res = await fetch("http://localhost:5000/registrations");
            const data = await res.json();
            setParticipants(data);
        } catch (error) {
            console.error(error);
        }
    };

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
                        <option>All Events</option>
                    </select>

                    <input
                        type="text"
                        className="mp-search"
                        placeholder="Search student name or email..."
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
                        {/* this portion is done by praveen kumar */}
                        {participants.map((p) => (
                            <tr key={p._id}>
                                <td data-label="Student Name">
                                {/* this section of praveen kumar code is end here */}
                                    <div className="mp-student-name">{p.userId?.name}</div>
                                    <div className="mp-student-email">{p.userId?.email}</div>
                                </td>

                                {/* this portion is done by praveen kumar */}
                                <td data-label="Event">{p.eventId?.title}</td>
                                <td data-label="Date">{new Date(p.createdAt).toLocaleDateString()}</td>

                                <td data-label="Status">
                                {/* this section of praveen kumar code is end here */}
                                    <span className={`mp-status mp-status-${p.status.toLowerCase()}`}>
                                        {p.status}
                                    </span>
                                </td>

                                {/* this portion is done by praveen kumar */}
                                <td data-label="Actions">
                                {/* this section of praveen kumar code is end here */}
                                    {p.status === "Pending" && (
                                        <div className="mp-actions">
                                            <button className="mp-approve-btn" onClick={() => handleApprove(p._id)}>✓</button>
                                            <button className="mp-reject-btn" onClick={() => handleReject(p._id)}>✕</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}