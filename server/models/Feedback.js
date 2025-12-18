import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comments: { type: String, default: "" }
}, {
  timestamps: { createdAt: "timestamp", updatedAt: false }
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);

export default Feedback;