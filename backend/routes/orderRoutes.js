const express = require('express');
const {
  createOrder,
  getOrder,
  getMyOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Checkout can be used as guest or logged-in; attach user if token present
const optionalAuth = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return next();
  try {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch (_) {
    // ignore invalid token for guest checkout
  }
  next();
};

router.post('/', optionalAuth, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/:orderNumber', getOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
