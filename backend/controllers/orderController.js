const Order = require('../models/Order');

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RSN-${year}-${rand}`;
}

// Very light Luhn check + card format validation to "simulate" a payment gateway
function validateCardSimulation({ cardNumber, expiry, cvv }) {
  if (!cardNumber || !expiry || !cvv) return { valid: false, reason: 'Missing card fields' };
  const digitsOnly = cardNumber.replace(/\s+/g, '');
  if (!/^\d{13,19}$/.test(digitsOnly)) return { valid: false, reason: 'Invalid card number format' };

  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  if (sum % 10 !== 0) return { valid: false, reason: 'Card failed Luhn check' };
  if (!/^\d{3,4}$/.test(cvv)) return { valid: false, reason: 'Invalid CVV' };
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return { valid: false, reason: 'Invalid expiry format (MM/YY)' };

  return { valid: true };
}

// POST /api/orders
async function createOrder(req, res, next) {
  try {
    const { customer, shippingAddress, items, paymentMethod, card } = req.body;
    if (!customer?.name || !customer?.phone || !shippingAddress?.address || !items?.length) {
      return res.status(400).json({ success: false, message: 'Missing required order fields' });
    }

    const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
    const deliveryFee = subtotal >= 5000 ? 0 : 350; // free delivery over Rs.5000
    const totalAmount = subtotal + deliveryFee;

    let paymentStatus = 'pending';
    if (paymentMethod === 'card_simulation') {
      const result = validateCardSimulation(card || {});
      if (!result.valid) {
        return res.status(400).json({ success: false, message: `Payment failed: ${result.reason}` });
      }
      paymentStatus = 'paid';
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user?._id,
      customer,
      shippingAddress: { country: 'Sri Lanka', ...shippingAddress },
      items,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      paymentStatus,
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:orderNumber
async function getOrder(req, res, next) {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders (own orders, or all for admin)
async function getMyOrders(req, res, next) {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
}

// PUT /api/orders/:id/status (admin)
async function updateOrderStatus(req, res, next) {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getOrder, getMyOrders, updateOrderStatus };
