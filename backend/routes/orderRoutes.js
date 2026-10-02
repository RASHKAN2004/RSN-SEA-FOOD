const express = require("express");
const {
  createOrder,
  getOrder,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/auth");
const { requestEmailOtp, verifyEmailOtp } = require("../controllers/checkoutVerificationController");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many verification-code requests. Try again later." },
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many verification attempts. Request a new code and try again later." },
});

router.post("/email-otp/request", protect, otpRequestLimiter, requestEmailOtp);
router.post("/email-otp/verify", protect, otpVerifyLimiter, verifyEmailOtp);
router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/:orderNumber", protect, getOrder);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
