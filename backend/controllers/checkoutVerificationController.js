const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const CheckoutEmailOtp = require("../models/CheckoutEmailOtp");

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function hashCode(code) {
  return crypto
    .createHash("sha256")
    .update(`${process.env.JWT_SECRET}:${code}`)
    .digest("hex");
}

function getTransporter() {
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!host || !user || !pass) return null;
  const port = Number(process.env.EMAIL_PORT || 587);
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

async function requestEmailOtp(req, res, next) {
  try {
    const email = normalizeEmail(req.body.email);
    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address" });
    }

    const transporter = getTransporter();
    if (!transporter) {
      return res.status(503).json({
        success: false,
        message: "Email verification is temporarily unavailable. Please try again shortly.",
      });
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);
    await CheckoutEmailOtp.findOneAndUpdate(
      { user: req.user._id, email },
      {
        $set: { codeHash: hashCode(code), attempts: 0, expiresAt },
        $unset: { verificationId: 1, verifiedAt: 1 },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: "Your RSN Sea Food checkout verification code",
        text: `Your RSN Sea Food verification code is ${code}. It expires in 10 minutes. Do not share this code with anyone.`,
        html: `<div style="font-family:Arial,sans-serif;color:#16353d"><h2>Verify your email</h2><p>Your RSN Sea Food checkout verification code is:</p><p style="font-size:28px;font-weight:bold;letter-spacing:6px">${code}</p><p>This code expires in 10 minutes. Do not share it with anyone.</p></div>`,
      });
    } catch (mailError) {
      await CheckoutEmailOtp.deleteOne({ user: req.user._id, email });
      throw mailError;
    }
    return res.json({ success: true, message: `Verification code sent to ${email}`, expiresInSeconds: OTP_TTL_MS / 1000 });
  } catch (err) {
    next(err);
  }
}

async function verifyEmailOtp(req, res, next) {
  try {
    const email = normalizeEmail(req.body.email);
    const code = String(req.body.code || "").trim();
    if (!EMAIL_PATTERN.test(email) || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ success: false, message: "Enter your email and the 6-digit code" });
    }
    const record = await CheckoutEmailOtp.findOne({ user: req.user._id, email }).select("+codeHash");
    if (!record || record.expiresAt <= new Date()) {
      return res.status(400).json({ success: false, message: "This code has expired. Request a new code." });
    }
    if (record.attempts >= MAX_ATTEMPTS) {
      return res.status(429).json({ success: false, message: "Too many incorrect codes. Request a new code." });
    }
    if (hashCode(code) !== record.codeHash) {
      await CheckoutEmailOtp.updateOne({ _id: record._id }, { $inc: { attempts: 1 } });
      return res.status(400).json({ success: false, message: "Incorrect verification code" });
    }
    const verificationId = crypto.randomUUID();
    await CheckoutEmailOtp.updateOne(
      { _id: record._id },
      { verificationId, verifiedAt: new Date() },
    );
    const verificationToken = jwt.sign(
      { purpose: "checkout_email", userId: String(req.user._id), email, verificationId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );
    return res.json({ success: true, message: "Email verified", verificationToken });
  } catch (err) {
    next(err);
  }
}

module.exports = { requestEmailOtp, verifyEmailOtp };
