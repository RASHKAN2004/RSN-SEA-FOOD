const mongoose = require('mongoose');

const SizeOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // e.g. "500g", "1kg"
    priceMultiplier: { type: Number, default: 1 },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Barramundi"
    localName: { type: String, trim: true }, // e.g. "Modha"
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Tuna', 'Indian Mackerel', 'Sail Fish', 'Crab', 'Prawn',
        'Cuttle Fish', 'Barramundi', 'Skipjack Tuna', 'Mullet',
        'Seer Fish', 'Sardine', 'Anchovy', 'Squid', 'Lobster',
      ],
    },
    description: { type: String, required: true },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    minimumQuantity: { type: String, default: '500g' }, // display label
    price: { type: Number, required: true }, // starting price (LKR) per minimumQuantity
    unit: { type: String, default: 'kg' },
    sizes: [SizeOptionSchema],
    freshnessGrade: {
      type: String,
      enum: ['Daily Catch', 'Lagoon Sourced', 'Export Grade'],
      default: 'Daily Catch',
    },
    availability: {
      type: String,
      enum: ['In Stock', 'Seasonal Catch', 'Out of Stock'],
      default: 'In Stock',
    },
    stockKg: { type: Number, default: 100 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', localName: 'text', category: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
