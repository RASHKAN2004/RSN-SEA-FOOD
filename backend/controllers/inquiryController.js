const Inquiry = require("../models/Inquiry");

// POST /api/inquiries
async function createInquiry(req, res, next) {
  try {
    const { name, phone, whatsapp, district, message } = req.body;
    if (
      !name ||
      !phone ||
      !message ||
      String(name).length > 100 ||
      String(phone).length > 30 ||
      String(message).length > 2000
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "name, phone and message are required",
        });
    }
    const inquiry = await Inquiry.create({
      name,
      phone,
      whatsapp,
      district,
      message,
    });
    res
      .status(201)
      .json({
        success: true,
        inquiry,
        message: "Thank you! We will contact you shortly.",
      });
  } catch (err) {
    next(err);
  }
}

// GET /api/inquiries (admin)
async function getInquiries(req, res, next) {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, inquiries });
  } catch (err) {
    next(err);
  }
}

// PUT /api/inquiries/:id/status (admin)
async function updateInquiryStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!["New", "Contacted", "Closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry status",
      });
    }
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );
    if (!inquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Inquiry not found" });
    }
    res.json({ success: true, inquiry });
  } catch (err) {
    next(err);
  }
}

module.exports = { createInquiry, getInquiries, updateInquiryStatus };
