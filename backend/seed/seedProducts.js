require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const products = [
  {
    name: 'Anchovy', localName: 'Hendhella', slug: 'anchovy-hendhella', category: 'Anchovy',
    description: 'Freshly sourced anchovy, carefully handled and packed to maintain quality and freshness until delivery.',
    image: '/images/products/anchovy.jpg', gallery: ['/images/products/anchovy.jpg'],
    minimumQuantity: '500g', price: 1400, sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }],
    freshnessGrade: 'Daily Catch', featured: true,
  },
  {
    name: 'Barramundi', localName: 'Modha', slug: 'barramundi-modha', category: 'Barramundi',
    description: 'Freshly sourced Barramundi, carefully handled and packed to maintain quality and freshness until delivery.',
    image: '/images/products/barramundi.jpg', gallery: ['/images/products/barramundi.jpg'],
    minimumQuantity: '500g', price: 2380, sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }],
    freshnessGrade: 'Daily Catch', featured: true,
  },
  {
    name: 'Large Crab', localName: 'Kakuluwā', slug: 'large-crab-kakuluwa', category: 'Crab',
    description: 'Live mud crabs, graded and handled with care for maximum freshness on arrival.',
    image: '/images/products/crab.jpg', gallery: ['/images/products/crab.jpg'],
    minimumQuantity: '500g', price: 2980, sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }],
    freshnessGrade: 'Lagoon Sourced', featured: true,
  },
  {
    name: 'Yellowfin Tuna', localName: 'Kelawalla', slug: 'yellowfin-tuna-kelawalla', category: 'Tuna',
    description: 'Export-grade Yellowfin Tuna, sashimi quality, sourced fresh from Kalpitiya waters.',
    image: '/images/products/tuna.jpg', gallery: ['/images/products/tuna.jpg'],
    minimumQuantity: '500g', price: 2200, sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }],
    freshnessGrade: 'Export Grade',
  },
  {
    name: 'Skipjack Tuna', localName: 'Balaya', slug: 'skipjack-tuna-balaya', category: 'Skipjack Tuna',
    description: 'Firm, flavourful skipjack tuna, a local favourite for curries and grilling.',
    image: '/images/products/skipjack-tuna.jpg', gallery: ['/images/products/skipjack-tuna.jpg'],
    minimumQuantity: '500g', price: 1200, sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }],
    freshnessGrade: 'Daily Catch',
  },
  {
    name: 'Indian Mackerel', localName: 'Kumbalawa', slug: 'indian-mackerel-kumbalawa', category: 'Indian Mackerel',
    description: 'Fresh Indian Mackerel, cleaned and ready for cooking.',
    image: '/images/products/mackerel.jpg', gallery: ['/images/products/mackerel.jpg'],
    minimumQuantity: '500g', price: 950, sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }],
    freshnessGrade: 'Daily Catch',
  },
  {
    name: 'Sail Fish', localName: 'Thalapath', slug: 'sail-fish-thalapath', category: 'Sail Fish',
    description: 'Prized sail fish steaks, firm texture, great for grilling.',
    image: '/images/products/sailfish.jpg', gallery: ['/images/products/sailfish.jpg'],
    minimumQuantity: '500g', price: 1850, sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }],
    freshnessGrade: 'Daily Catch',
  },
  {
    name: 'Seer Fish', localName: 'Surumai', slug: 'seer-fish-surumai', category: 'Seer Fish',
    description: 'Premium Seer Fish steaks, boneless cuts available on request.',
    image: '/images/products/seer-fish.jpg', gallery: ['/images/products/seer-fish.jpg'],
    minimumQuantity: '500g', price: 2600, sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }],
    freshnessGrade: 'Export Grade',
  },
  {
    name: 'Sardine', localName: 'Salaya', slug: 'sardine-salaya', category: 'Sardine',
    description: 'Small, oil-rich sardines, cleaned and iced fresh daily.',
    image: '/images/products/sardine.jpg', gallery: ['/images/products/sardine.jpg'],
    minimumQuantity: '500g', price: 650, sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }],
    freshnessGrade: 'Daily Catch',
  },
  {
    name: 'Large Prawn', localName: 'Issa', slug: 'large-prawn-issa', category: 'Prawn',
    description: 'Jumbo Tiger Prawns, head-on, sourced fresh from Kalpitiya lagoon.',
    image: '/images/products/prawn.jpg', gallery: ['/images/products/prawn.jpg'],
    minimumQuantity: '500g', price: 2450, sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }],
    freshnessGrade: 'Lagoon Sourced', featured: true,
  },
  {
    name: 'Cuttle Fish', localName: 'Dallo', slug: 'cuttle-fish-dallo', category: 'Cuttle Fish',
    description: 'Cleaned cuttlefish tubes, tender and ready to cook.',
    image: '/images/products/cuttlefish.jpg', gallery: ['/images/products/cuttlefish.jpg'],
    minimumQuantity: '500g', price: 1650, sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }],
    freshnessGrade: 'Daily Catch',
  },
  {
    name: 'Squid', localName: 'Della', slug: 'squid-della', category: 'Squid',
    description: 'Fresh squid rings and tubes, cleaned and ready for cooking.',
    image: '/images/products/squid.jpg', gallery: ['/images/products/squid.jpg'],
    minimumQuantity: '500g', price: 1750, sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }],
    freshnessGrade: 'Daily Catch',
  },
  {
    name: 'Lobster', localName: 'Ibba Kakuluwa', slug: 'lobster-ibba-kakuluwa', category: 'Lobster',
    description: 'Live spiny rock lobster, graded by weight for premium dining.',
    image: '/images/products/lobster.jpg', gallery: ['/images/products/lobster.jpg'],
    minimumQuantity: '500g', price: 4200, sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }],
    freshnessGrade: 'Export Grade', featured: true,
  },
  {
    name: 'Mullet', localName: 'Godaya', slug: 'mullet-godaya', category: 'Mullet',
    description: 'Fresh lagoon mullet, mild flavour, great for frying or curry.',
    image: '/images/products/mullet.jpg', gallery: ['/images/products/mullet.jpg'],
    minimumQuantity: '500g', price: 1100, sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }],
    freshnessGrade: 'Lagoon Sourced',
  },
];

async function run() {
  await connectDB();
  await Product.deleteMany({});
  const inserted = await Product.insertMany(products);
  console.log(`[Seed] Inserted ${inserted.length} products.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
