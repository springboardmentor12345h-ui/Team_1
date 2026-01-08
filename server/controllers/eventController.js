import Event from "../models/event.js";
import cloudinary from "../config/cloudinary.js";

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
    let imageUrl = req.body.imageUrl;

    // upload file if present
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      );
      imageUrl = uploadResult.secure_url;
    }

    const event = await Event.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      max_participants: Number(req.body.max_participants),
      location: req.body.location,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      requirements: req.body.requirements,
      tags: req.body.tags
        ? req.body.tags.split(",").map(t => t.trim())
        : [],
      image:
        imageUrl ||
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",

      // 🔐 attach creator (admin/user)
      createdBy: req.user.id
    });

    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create event" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // 🔐 ownership check
    if (event.createdBy.toString() !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete event" });
  }
};