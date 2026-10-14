const express = require("express");
const { getDashboard } = require("../controllers/adminDashboardController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getDashboard);

module.exports = router;
