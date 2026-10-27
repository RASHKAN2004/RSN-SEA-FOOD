const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, trim: true, maxlength: 80, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
