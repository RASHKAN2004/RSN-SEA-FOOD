const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    district: { type: String, default: 'Puttalam' },
    message: { type: String, required: true },
    status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', InquirySchema);
