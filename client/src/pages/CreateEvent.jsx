import React, { useState, useRef, useEffect } from "react";
import "./CreateEvent.css";
import { useNavigate } from "react-router-dom";
import calendarIcon from "../assets/calendr.svg";

export default function CreateEvent() {
  const navigate = useNavigate();

  const startInput = useRef(null);
  const endInput = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    max_participants: "",
    location: "",
    start_date: "",
    end_date: "",
    requirements: "",
    tags: "",
    image: "",        // URL
    imageFile: null   // FILE
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const res = await fetch("http://localhost:5000/health");
        if (!res.ok) throw new Error("Backend not healthy");
      } catch (err) {
        console.error("Backend health check failed", err);
        navigate("/error", { replace: true });
      }
    };

    checkBackendHealth();
  }, []);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5 MB");
        e.target.value = "";
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed");
        e.target.value = "";
        return;
      }

      setFormData(prev => ({
        ...prev,
        imageFile: file,
        image: ""
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
      imageFile: e.target.name === "image" ? null : prev.imageFile
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (formData.image && formData.imageFile) {
      alert("Use either Image URL or Image Upload, not both");
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("max_participants", formData.max_participants);
      data.append("location", formData.location);
      data.append("start_date", formData.start_date);
      data.append("end_date", formData.end_date);
      data.append("requirements", formData.requirements);
      data.append("tags", formData.tags);

      // IMPORTANT: only ONE image source
      if (formData.imageFile) {
        data.append("image", formData.imageFile);   // multer file
      } else if (formData.image) {
        data.append("imageUrl", formData.image);    // plain URL
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: {
          "x-user-id": user?._id
        },
        body: data
      });

      if (!res.ok) {
        if (res.status === 500 || res.status === 0) {
          throw new Error("Backend not reachable");
        }
        throw new Error("Failed to create event");
      }

      alert("Event successfully created");
      navigate("/college-dashboard");
    } catch (err) {
      console.error(err);
      setApiError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (apiError) {
    navigate("/error", { replace: true });
    return null;
  }

  return (
    <div className="ce-page">
      <div className="ce-container">
        <h1 className="ce-title">Create New Event</h1>
        <p className="ce-subtitle">
          Fill in the details to create an exciting event for students
        </p>

        <form className="ce-form" onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className="ce-field">
            <label>Event Title *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g., Inter-College Hackathon 2024"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="ce-field">
            <label>Description *</label>
            <textarea
              name="description"
              rows="4"
              required
              placeholder="Provide a detailed description of your event..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* CATEGORY + MAX */}
          <div className="ce-row">
            <div className="ce-field">
              <label>Category *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="hackathon">Hackathon</option>
                <option value="cultural">Cultural</option>
                <option value="sports">Sports</option>
                <option value="workshop">Workshop</option>
                <option value="competition">Competition</option>
              </select>
            </div>

            <div className="ce-field">
              <label>Max Participants *</label>
              <input
                type="number"
                name="max_participants"
                min="0"
                required
                placeholder="e.g., 200"
                value={formData.max_participants}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* LOCATION */}
          <div className="ce-field">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g., Tech Innovation Center, Building A"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* DATES */}
          <div className="ce-row2">
            <div className="ce-field">
              <label>Start Date *</label>
              <div className="dt-wrapper">
                <input
                  type="datetime-local"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                  ref={startInput}
                />
                <img
                  src={calendarIcon}
                  className="dt-icon"
                  onClick={() => startInput.current.showPicker()}
                />
              </div>
            </div>

            <div className="ce-field">
              <label>End Date *</label>
              <div className="dt-wrapper">
                <input
                  type="datetime-local"
                  name="end_date"
                  required
                  value={formData.end_date}
                  onChange={handleChange}
                  ref={endInput}
                />
                <img
                  src={calendarIcon}
                  className="dt-icon"
                  onClick={() => endInput.current.showPicker()}
                />
              </div>
            </div>
          </div>

          {/* REQUIREMENTS */}
          <div className="ce-field">
            <label>Requirements *</label>
            <input
              type="text"
              name="requirements"
              required
              placeholder="e.g., Laptop, Student ID, Team of 2-4 members"
              value={formData.requirements}
              onChange={handleChange}
            />
          </div>

          {/* TAGS */}
          <div className="ce-field">
            <label>Tags *</label>
            <input
              type="text"
              name="tags"
              required
              placeholder="e.g., Technology, Competition, Team Event"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          {/* IMAGE */}
          <div className="ce-field">
            <label>Event Image (URL or Upload)</label>
            <input
              type="url"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          {/* BUTTONS */}
          <div className="ce-buttons">
            <button
              type="submit"
              className="ce-submit"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Event"}
            </button>

            <button
              type="button"
              className="ce-cancel"
              onClick={() => navigate("/college-dashboard")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}