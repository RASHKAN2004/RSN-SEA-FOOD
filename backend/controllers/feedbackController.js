const Feedback = require("../models/Feedback");

async function createFeedback(req, res, next) {
  try {
    const body = req.body || {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const location =
      typeof body.location === "string" ? body.location.trim() : "";
    const message =
      typeof body.message === "string" ? body.message.trim() : "";
    const rating = Number(body.rating);

    if (
      name.length < 2 ||
      name.length > 100 ||
      location.length > 80 ||
      message.length < 5 ||
      message.length > 1000 ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a name, a rating from 1 to 5, and feedback between 5 and 1000 characters.",
      });
    }

    const feedback = await Feedback.create({
      name,
      location,
      rating,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Thank you for sharing your feedback!",
      feedback,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createFeedback };
