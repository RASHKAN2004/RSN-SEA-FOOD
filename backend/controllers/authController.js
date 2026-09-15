const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User"); // --- IGNORE ---
const { generateToken } = require("../middleware/auth");
const { DEFAULT_DISTRICT } = require("../config/districts");

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
});

function getResetUrl(token) {
  const baseUrl = process.env.CLIENT_URL || "http://localhost:3000";
  return `${baseUrl}/admin/reset-password?token=${token}`;
}

async function sendResetEmail(email, resetUrl) {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || user || "no-reply@rsnseafood.local";

  if (!host || !user || !pass) {
    console.log(`[Auth] Password reset email for ${email}`);
    console.log(`[Auth] Reset URL: ${resetUrl}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: "RSN Sea Food Password Reset",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #16353d;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your RSN Sea Food admin account.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 18px;background:#f76a2b;color:#fff;text-decoration:none;border-radius:8px;">
            Reset Password
          </a>
        </p>
        <p>If the button does not work, copy and open this link:</p>
        <p>${resetUrl}</p>
        <p>This link is valid for 30 minutes.</p>
      </div>
    `,
  });
}

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
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    if (
      !name ||
      !normalizedEmail ||
      !password ||
      !phone ||
      String(name).trim().length > 100 ||
      String(password).length < 6 ||
      String(password).length > 128 ||
      String(phone).length > 30
    ) {
      return res.status(400).json({
        success: false,
        message: "name, email, password, phone are required",
      });
    }
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }
    const user = await User.create({
      name,
      email: normalizedEmail,
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
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    if (!normalizedEmail || !password || String(password).length > 128) {
      return res
        .status(400)
        .json({ success: false, message: "email and password are required" });
    }
    const user = await User.findOne({ email: normalizedEmail }).select(
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

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail, role: "admin" });

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists for this email, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    const resetUrl = getResetUrl(token);
    await sendResetEmail(user.email, resetUrl);

    return res.status(200).json({
      success: true,
      message: "Reset instructions have been sent to your email.",
      resetUrl: process.env.NODE_ENV !== "production" ? resetUrl : undefined,
    });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required",
      });
    }

    if (String(password).length < 6 || String(password).length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
      role: "admin",
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now log in with your new password.",
    });
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

async function updateProfile(req, res, next) {
  try {
    const { name, phone, whatsapp, street, city, district, postalCode } =
      req.body;
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }
    if ((street && !city) || (!street && city)) {
      return res.status(400).json({
        success: false,
        message: "Street and city are both required for an address",
      });
    }

    req.user.name = String(name).trim();
    req.user.phone = String(phone).trim();
    req.user.whatsapp = whatsapp ? String(whatsapp).trim() : undefined;
    if (street && city) {
      const address = {
        label: req.user.addresses[0]?.label || "Home",
        street: String(street).trim(),
        city: String(city).trim(),
        district: district || DEFAULT_DISTRICT,
        postalCode: postalCode ? String(postalCode).trim() : undefined,
      };
      if (req.user.addresses.length) req.user.addresses[0] = address;
      else req.user.addresses = [address];
    } else {
      req.user.addresses = [];
    }
    await req.user.save();
    res.json({ success: true, user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
  me,
  updateProfile,
};
