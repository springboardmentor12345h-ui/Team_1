import Event from "../models/event.js";

export const getEvents = async (req, res) => {
  const events = await Event.find();
  res.json(events);
};

export const getEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.json(event);
};

export const createEvent = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      registered_count: req.body.registered_count ?? 0,
      created_at: req.body.created_at ?? new Date().toISOString(),
    };
    const event = await Event.create(payload);
    res.status(201).json(event);
  } catch (err) {
    console.error("Create Event Error:", err.message);
    res.status(400).json({ error: "Failed to create event", details: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};