const express = require("express");
const {
  createOrder,
  getOrder,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/:orderNumber", protect, getOrder);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
