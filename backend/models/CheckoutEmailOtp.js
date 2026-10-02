const mongoose = require("mongoose");

// One short-lived code per signed-in customer and email address. The TTL index
// lets MongoDB remove expired codes automatically.
const CheckoutEmailOtpSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    codeHash: { type: String, required: true, select: false },
    attempts: { type: Number, default: 0 },
    verificationId: { type: String, select: false },
    verifiedAt: { type: Date },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true },
);

CheckoutEmailOtpSchema.index({ user: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("CheckoutEmailOtp", CheckoutEmailOtpSchema);
