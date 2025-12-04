// server/models/Registration.js
import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      required: true,
    },
    // optional metadata you might want later:
    notes: { type: String, default: "" }
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Prevent the same user registering for the same event twice
RegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Registration", RegistrationSchema);