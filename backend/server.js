const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const metaRoutes = require("./routes/metaRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const configuredClientOrigin = process.env.CLIENT_URL || "http://localhost:3000";
const localDevelopmentOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
]);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (origin === configuredClientOrigin) return true;
  return process.env.NODE_ENV !== "production" && localDevelopmentOrigins.has(origin);
}

// --- Security & core middleware ---
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Serve admin-uploaded product images (e.g. http://localhost:5000/uploads/products/xyz.jpg)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate limiting: 100 requests / 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// --- Routes ---
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "RSN Sea Food API is running",
    timestamp: new Date().toISOString(),
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}
if (
  process.env.NODE_ENV === "production" &&
  process.env.JWT_SECRET.length < 32
) {
  throw new Error("JWT_SECRET must be at least 32 characters in production");
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `[Server] RSN Sea Food API running on port ${PORT} (${process.env.NODE_ENV || "development"})`,
    );
  });
});

module.exports = app;
