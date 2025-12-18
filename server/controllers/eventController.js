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
  const event = await Event.create(req.body);
  res.json(event);
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