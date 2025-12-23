import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get notifications for a specific student
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    })
      .populate("eventId", "title")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark all notifications as read for a user
router.patch("/mark-all-read/:userId", async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
});

export default router;