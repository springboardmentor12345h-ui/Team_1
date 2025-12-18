import express from "express";
import Feedback from "../models/Feedback.js";
import mongoose from "mongoose";

const router = express.Router();

// Create Feedback
router.post("/", async (req, res) => {
  try {
    const { event_id, user_id, rating, comments } = req.body;

    if (!event_id || !user_id || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const fb = await Feedback.create({
      event_id,
      user_id,
      rating,
      comments
    });

    res.status(201).json(fb);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all feedback for a specific event
router.get("/event/:eventId", async (req, res) => {
  try {
    const feedback = await Feedback.find({ event_id: req.params.eventId })
      .populate("user_id", "name email");

    res.json(feedback);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Summary: average rating + count for an event
router.get("/summary/:eventId", async (req, res) => {
  try {
    const eventObjectId = new mongoose.Types.ObjectId(req.params.eventId);

    const summary = await Feedback.aggregate([
      { $match: { event_id: eventObjectId } },
      {
        $group: {
          _id: "$event_id",
          averageRating: { $avg: "$rating" },
          totalFeedback: { $sum: 1 }
        }
      }
    ]);

    res.json(summary[0] || { averageRating: 0, totalFeedback: 0 });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;