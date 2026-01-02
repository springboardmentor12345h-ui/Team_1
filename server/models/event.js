import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  college_id: String,
  title: String,
  description: String,
  category: String,
  location: String,
  start_date: String,
  end_date: String,
  max_participants: Number,
  registered_count: Number,
  status: String,
  image: String,
  requirements: String,
  tags: [String],

  // 🔑 ownership field
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Event", eventSchema);