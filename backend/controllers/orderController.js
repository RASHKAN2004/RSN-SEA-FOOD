const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const Product = require("../models/Product");
const CheckoutEmailOtp = require("../models/CheckoutEmailOtp");

function generateOrderNumber() {
  const year = new Date().getFullYear();
  return `RSN-${year}-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
}

function weightInKg(label) {
  const match = String(label || "").trim().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(kg|g)$/);
  if (!match) return null;
  const value = Number(match[1]);
  return match[2] === "kg" ? value : value / 1000;
}

// PayHere Mandatory MD5 Hash formula (ICT2142 Practical 06 Slide 8):
// Hash = UPPERCASE( MD5( merchant_id + order_id + amount + currency + UPPERCASE( MD5( merchant_secret ) ) ) )
function generatePayHereHash({ merchantId, orderId, amount, currency = "LKR", merchantSecret }) {
  const formattedAmount = Number(amount).toFixed(2);
  const hashedSecret = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();
  const hashString = `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`;
  return crypto.createHash("md5").update(hashString).digest("hex").toUpperCase();
}

// Very light Luhn check + card format validation to "simulate" a payment gateway
function validateCardSimulation({ cardNumber, expiry, cvv }) {
  if (!cardNumber || !expiry || !cvv)
    return { valid: false, reason: "Missing card fields" };
  const digitsOnly = cardNumber.replace(/\s+/g, "");
  if (!/^\d{13,19}$/.test(digitsOnly))
    return { valid: false, reason: "Invalid card number format" };

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
  if (sum % 10 !== 0) return { valid: false, reason: "Card failed Luhn check" };
  if (!/^\d{3,4}$/.test(cvv)) return { valid: false, reason: "Invalid CVV" };
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry))
    return { valid: false, reason: "Invalid expiry format (MM/YY)" };

  return { valid: true };
}

// POST /api/orders
async function createOrder(req, res, next) {
  try {
    const {
      customer,
      shippingAddress,
      items,
      paymentMethod = "payhere",
      card,
      emailVerificationToken,
    } = req.body;

    if (
      !customer?.name ||
      !customer?.phone ||
      !customer?.email ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !items?.length
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required order fields" });
    }

    const email = String(customer.email).trim().toLowerCase();
    if (emailVerificationToken) {
      try {
        const verification = jwt.verify(emailVerificationToken, process.env.JWT_SECRET);
        if (
          verification.purpose !== "checkout_email" ||
          (req.user && verification.userId !== String(req.user._id)) ||
          verification.email !== email ||
          !verification.verificationId
        ) throw new Error("Email verification does not match");
        await CheckoutEmailOtp.findOneAndDelete({
          email,
          verificationId: verification.verificationId,
          verifiedAt: { $exists: true },
          expiresAt: { $gt: new Date() },
        }).select("+verificationId");
      } catch (_) {
        return res
          .status(403)
          .json({ success: false, message: "Verify this delivery email before placing the order" });
      }
    }
    customer.email = email;

    if (
      !["payhere", "card_simulation", "cash_on_delivery", "whatsapp_manual"].includes(
        paymentMethod,
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment method" });
    }
    if (paymentMethod === "payhere" && !process.env.PAYHERE_MERCHANT_SECRET) {
      return res.status(503).json({
        success: false,
        message: "Online payment is not configured. Please choose another payment method.",
      });
    }

    const requestedItems = items.map((item) => ({
      slug: String(item.slug || "").trim(),
      quantity: Number(item.quantity ?? item.quantityKg),
      sizeLabel: String(item.sizeLabel || "").trim(),
    }));
    if (
      requestedItems.some(
        (item) =>
          !item.slug ||
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0 ||
          item.quantity > 100,
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order item or quantity" });
    }

    const products = await Product.find({
      slug: { $in: requestedItems.map((item) => item.slug) },
    });
    const productBySlug = new Map(
      products.map((product) => [product.slug, product]),
    );
    const normalizedItems = [];
    for (const item of requestedItems) {
      const product = productBySlug.get(item.slug);
      if (!product || product.availability === "Out of Stock") {
        return res.status(400).json({
          success: false,
          message: `Product unavailable: ${item.slug}`,
        });
      }
      const size =
        product.sizes.find((option) => option.label === item.sizeLabel) ||
        product.sizes[0];
      const sizeLabel = size?.label || product.minimumQuantity;
      const packageWeight = weightInKg(sizeLabel) || weightInKg(product.minimumQuantity);
      if (!packageWeight || packageWeight <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid package size for product: ${item.slug}`,
        });
      }
      const price = Math.round(product.price * (size?.priceMultiplier || 1));
      normalizedItems.push({
        productId: product._id,
        name: product.name,
        localName: product.localName,
        image: product.image,
        sizeLabel,
        quantity: item.quantity,
        price,
        quantityKg: Math.round(packageWeight * item.quantity * 1000) / 1000,
        itemTotal: price * item.quantity,
      });
    }
    const subtotal = normalizedItems.reduce(
      (sum, item) => sum + item.itemTotal,
      0,
    );
    const deliveryFee = subtotal >= 5000 ? 0 : 350; // free delivery over Rs.5000
    const totalAmount = subtotal + deliveryFee;

    let paymentStatus = "pending";
    if (paymentMethod === "card_simulation") {
      const result = validateCardSimulation(card || {});
      if (!result.valid) {
        return res.status(400).json({
          success: false,
          message: `Payment failed: ${result.reason}`,
        });
      }
      paymentStatus = "paid";
    }

    const orderNumber = generateOrderNumber();
    const order = await Order.create({
      orderNumber,
      user: req.user?._id,
      customer,
      shippingAddress: { country: "Sri Lanka", ...shippingAddress },
      items: normalizedItems,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus: paymentStatus === "paid" ? "Confirmed" : "Pending",
    });

    let payhere;
    if (paymentMethod === "payhere") {
      const merchantId = process.env.PAYHERE_MERCHANT_ID || "1238347";
      const formattedAmount = totalAmount.toFixed(2);
      const currency = "LKR";
      const hash = generatePayHereHash({
        merchantId,
        orderId: order.orderNumber,
        amount: totalAmount,
        currency,
        merchantSecret: process.env.PAYHERE_MERCHANT_SECRET,
      });
      payhere = {
        merchantId,
        orderId: order.orderNumber,
        amount: formattedAmount,
        currency,
        hash,
        checkoutUrl:
          process.env.PAYHERE_CHECKOUT_URL ||
          "https://sandbox.payhere.lk/pay/checkout",
      };
    }

    res.status(201).json({
      success: true,
      order,
      ...(payhere && { payhere }),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/orders/payhere-notify (PayHere IPN Webhook)
async function handlePayHereNotify(req, res, next) {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = req.body;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchantSecret) {
      return res.status(503).send("Payment gateway is not configured");
    }
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();
    const expectedHash = crypto
      .createHash("md5")
      .update(
        `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`,
      )
      .digest("hex")
      .toUpperCase();

    const receivedHash = String(md5sig || "").toUpperCase();
    const validSignature =
      /^[0-9A-F]{32}$/.test(receivedHash) &&
      crypto.timingSafeEqual(
        Buffer.from(expectedHash, "hex"),
        Buffer.from(receivedHash, "hex"),
      );
    const expectedMerchantId = process.env.PAYHERE_MERCHANT_ID || "1238347";
    if (!validSignature || String(merchant_id) !== expectedMerchantId) {
      console.warn("[PayHere IPN] Invalid MD5 signature verification failed");
      return res.status(400).send("Invalid signature");
    }

    const order = await Order.findOne({ orderNumber: order_id });
    if (!order) {
      console.warn(`[PayHere IPN] Order not found: ${order_id}`);
      return res.status(404).send("Order not found");
    }
    if (
      order.paymentMethod !== "payhere" ||
      String(payhere_currency) !== "LKR" ||
      Number(payhere_amount).toFixed(2) !== order.totalAmount.toFixed(2)
    ) {
      console.warn(`[PayHere IPN] Payment details do not match order ${order_id}`);
      return res.status(400).send("Payment details do not match order");
    }

    order.payherePaymentId = payment_id;
    order.payhereStatusCode = String(status_code);

    if (Number(status_code) === 2) {
      order.paymentStatus = "paid";
      order.orderStatus = "Confirmed";
    } else if (Number(status_code) === 0 && order.paymentStatus !== "paid") {
      order.paymentStatus = "pending";
    } else if (order.paymentStatus !== "paid") {
      order.paymentStatus = "failed";
    }

    await order.save();
    console.log(
      `[PayHere IPN] Order ${order_id} updated: status=${order.paymentStatus}`,
    );
    res.status(200).send("OK");
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:orderNumber
async function getOrder(req, res, next) {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    if (
      req.user &&
      req.user.role !== "admin" &&
      order.user &&
      String(order.user) !== String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this order",
      });
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders (own orders, or all for admin)
async function getMyOrders(req, res, next) {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
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
      { new: true, runValidators: true },
    );
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getOrder,
  getMyOrders,
  updateOrderStatus,
  getPayHereHash,
  handlePayHereNotify,
  generatePayHereHash,
};
