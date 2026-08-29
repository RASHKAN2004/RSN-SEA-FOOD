const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    localName: { type: String },
    image: { type: String },
    price: { type: Number, required: true },
    quantityKg: { type: Number, required: true },
    itemTotal: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customer: {
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String, required: true },
      whatsapp: { type: String },
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true, default: 'Puttalam' },
      postalCode: { type: String },
      country: { type: String, default: 'Sri Lanka' },
      deliveryInstructions: { type: String },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['card_simulation', 'cash_on_delivery', 'whatsapp_manual'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cold Packing', 'Dispatched', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
