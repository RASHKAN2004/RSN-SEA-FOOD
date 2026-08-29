const Inquiry = require('../models/Inquiry');

// POST /api/inquiries
async function createInquiry(req, res, next) {
  try {
    const { name, phone, whatsapp, district, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'name, phone and message are required' });
    }
    const inquiry = await Inquiry.create({ name, phone, whatsapp, district, message });
    res.status(201).json({ success: true, inquiry, message: 'Thank you! We will contact you shortly.' });
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

module.exports = { createInquiry, getInquiries };
