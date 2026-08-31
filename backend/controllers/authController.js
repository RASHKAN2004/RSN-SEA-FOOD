const User = require("../models/User"); // --- IGNORE ---
const { generateToken } = require("../middleware/auth");
const { DEFAULT_DISTRICT } = require("../config/districts");

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
});

async function register(req, res, next) {
  try {
    const {
      name,
      email,
      password,
      phone,
      whatsapp,
      district,
      city,
      street,
      postalCode,
    } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "name, email, password, phone are required",
      });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }
    const user = await User.create({
      name,
      email,
      password,
      phone,
      whatsapp,
      addresses: street
        ? [{ street, city, district: district || DEFAULT_DISTRICT, postalCode }]
        : [],
    });
    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions());
    res.status(201).json({ success: true, user: user.toSafeObject(), token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions());
    res.json({ success: true, user: user.toSafeObject(), token });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
}

async function me(req, res) {
  res.json({ success: true, user: req.user.toSafeObject() });
}

module.exports = { register, login, logout, me };
