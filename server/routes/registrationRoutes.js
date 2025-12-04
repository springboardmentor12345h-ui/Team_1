import express from "express";
import Registration from "../models/Registration.js";

const router = express.Router();

// Create registration
router.post("/", async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    if (!eventId || !userId) {
      return res.status(400).json({ message: "Missing eventId or userId" });
    }

    const reg = await Registration.create({
      eventId,
      userId,
      status: "Pending"
    });

    res.status(201).json(reg);

  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "User already registered for this event",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
});

// GET all registrations (for admin)
router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("userId", "name email")
      .populate("eventId", "title");

    res.json(registrations);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update status (approve/reject)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;