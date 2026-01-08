const Feedback = require('../models/Feedback');

exports.createFeedback = async (req, res) => {
  try {
    const { event_id, rating, comments } = req.body;
    // user id: from auth middleware (adjust key if your auth uses req.user or req.userId)
    const user_id = req.user && req.user._id ? req.user._id : req.userId || req.body.user_id;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });
    if (!event_id || !rating) return res.status(400).json({ error: 'event_id and rating required' });

    const fb = await Feedback.create({ event_id, user_id, rating, comments });
    return res.status(201).json({ success: true, feedback: fb });
  } catch (err) {
    console.error('createFeedback error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getFeedbackForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const feedbacks = await Feedback.find({ event_id: eventId }).populate('user_id', 'name email');
    return res.json({ success: true, data: feedbacks });
  } catch (err) {
    console.error('getFeedbackForEvent error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getFeedbackSummary = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.json({ averageRating: 0, totalFeedback: 0 });
    }

    const mongoose = require('mongoose');
    const objectId = new mongoose.Types.ObjectId(eventId);

    const summary = await Feedback.aggregate([
      { $match: { event_id: objectId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalFeedback: { $sum: 1 }
        }
      }
    ]);

    if (!summary || summary.length === 0) {
      return res.json({ averageRating: 0, totalFeedback: 0 });
    }

    return res.json({
      averageRating: summary[0].averageRating,
      totalFeedback: summary[0].totalFeedback
    });
  } catch (err) {
    console.error('getFeedbackSummary error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};