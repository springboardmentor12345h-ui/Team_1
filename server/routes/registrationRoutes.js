import express from "express";
import Registration from "../models/Registration.js";
import Notification from "../models/Notification.js";
import authMiddleware from "../middleware/authMiddleware.js";

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

router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("userId", "name email")
      .populate("eventId", "_id title createdBy");

    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
});

// Update status (approve/reject)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const registration = await Registration.findById(req.params.id)
      .populate("eventId");

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (
      !registration.eventId ||
      registration.eventId.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized to manage this registration" });
    }

    const updated = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Push notification ONLY when approved or rejected
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === "approved" || normalizedStatus === "rejected") {
      await Notification.create({
        userId: updated.userId,
        eventId: updated.eventId,
        type: normalizedStatus === "approved" ? "accepted" : "rejected",
        message:
          normalizedStatus === "approved"
            ? "Your registration has been approved."
            : "Your registration has been rejected.",
      });
      console.log("Notification created for:", updated.userId);
    }

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Admin: Get participant statistics
 * Returns counts of Approved / Pending / Rejected registrations
 */
router.get("/stats/participants", authMiddleware, async (req, res) => {
  try {
    const stats = await Registration.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert aggregation result into usable object
    const result = {
      approvedParticipants: 0,
      pendingParticipants: 0,
      rejectedParticipants: 0
    };

    stats.forEach(item => {
      if (item._id === "Approved") result.approvedParticipants = item.count;
      if (item._id === "Pending") result.pendingParticipants = item.count;
      if (item._id === "Rejected") result.rejectedParticipants = item.count;
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch participant stats" });
  }
});

export default router;