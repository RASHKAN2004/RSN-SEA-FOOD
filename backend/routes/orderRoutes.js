const express = require("express");
const {
  createOrder,
  getOrder,
  getMyOrders,
  updateOrderStatus,
  handlePayHereNotify,
  confirmPayHereSuccess,
  getPayHereHash,
} = require("../controllers/orderController");
const { protect, optionalAuth, adminOnly } = require("../middleware/auth");
const {
  requestEmailOtp,
  verifyEmailOtp,
} = require("../controllers/checkoutVerificationController");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many verification-code requests. Try again later.",
  },
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many verification attempts. Request a new code and try again later.",
  },
});

// PayHere payment gateway routes (ICT2142 Practical 06)
router.post("/payhere-notify", handlePayHereNotify);
router.post("/payhere-hash", getPayHereHash);
router.patch("/:orderNumber/payhere-success", confirmPayHereSuccess);

// Verification routes
router.post("/email-otp/request", protect, otpRequestLimiter, requestEmailOtp);
router.post("/email-otp/verify", protect, otpVerifyLimiter, verifyEmailOtp);

// Standard order routes
router.post("/", optionalAuth, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/:orderNumber", optionalAuth, getOrder);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
