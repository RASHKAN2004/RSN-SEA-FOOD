// Fallback/local product data — structured to match the backend Product schema.
// Used when the live API is unreachable, and as a reference for the data shape.
// Products added via the Admin Panel are stored in MongoDB and fetched live instead.
// Real product photography, stored in /public/images/products/
const IMG = {
  tuna: '/images/products/tuna.jpg',
  mackerel: '/images/products/mackerel.jpg',
  sailfish: '/images/products/sailfish.jpg',
  crab: '/images/products/crab.jpg',
  prawn: '/images/products/prawn.jpg',
  cuttlefish: '/images/products/cuttlefish.jpg',
  barramundi: '/images/products/barramundi.jpg',
  skipjack: '/images/products/skipjack-tuna.jpg',
  mullet: '/images/products/mullet.jpg',
  seerfish: '/images/products/seer-fish.jpg',
  sardine: '/images/products/sardine.jpg',
  anchovy: '/images/products/anchovy.jpg',
  squid: '/images/products/squid.jpg',
  lobster: '/images/products/lobster.jpg',
};

export const CATEGORIES = [
  { name: 'Tuna', image: IMG.tuna },
  { name: 'Indian Mackerel', image: IMG.mackerel },
  { name: 'Sail Fish', image: IMG.sailfish },
  { name: 'Crab', image: IMG.crab },
  { name: 'Prawn', image: IMG.prawn },
  { name: 'Cuttle Fish', image: IMG.cuttlefish },
  { name: 'Barramundi', image: IMG.barramundi },
  { name: 'Skipjack Tuna', image: IMG.skipjack },
  { name: 'Mullet', image: IMG.mullet },
  { name: 'Seer Fish', image: IMG.seerfish },
  { name: 'Sardine', image: IMG.sardine },
  { name: 'Anchovy', image: IMG.anchovy },
  { name: 'Squid', image: IMG.squid },
  { name: 'Lobster', image: IMG.lobster },
];

export const PRODUCTS = [
  { id: '1', name: 'Anchovy', localName: 'Hendhella', slug: 'anchovy-hendhella', category: 'Anchovy', minimumQuantity: '500g', price: 1400, image: IMG.anchovy, freshnessGrade: 'Daily Catch', availability: 'In Stock', description: 'Freshly sourced anchovy, carefully handled and packed to maintain quality and freshness until delivery.', sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }] },
  { id: '2', name: 'Barramundi', localName: 'Modha', slug: 'barramundi-modha', category: 'Barramundi', minimumQuantity: '500g', price: 2380, image: IMG.barramundi, freshnessGrade: 'Daily Catch', availability: 'In Stock', description: 'Freshly sourced Barramundi, carefully handled and packed to maintain quality and freshness until delivery.', sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }] },
  { id: '3', name: 'Large Crab', localName: 'Kakuluwā', slug: 'large-crab-kakuluwa', category: 'Crab', minimumQuantity: '500g', price: 2980, image: IMG.crab, freshnessGrade: 'Lagoon Sourced', availability: 'In Stock', description: 'Live mud crabs, graded and handled with care for maximum freshness on arrival.', sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }] },
  { id: '4', name: 'Yellowfin Tuna', localName: 'Kelawalla', slug: 'yellowfin-tuna-kelawalla', category: 'Tuna', minimumQuantity: '500g', price: 2200, image: IMG.tuna, freshnessGrade: 'Export Grade', availability: 'In Stock', description: 'Export-grade Yellowfin Tuna, sashimi quality, sourced fresh from Kalpitiya waters.', sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }] },
  { id: '5', name: 'Skipjack Tuna', localName: 'Balaya', slug: 'skipjack-tuna-balaya', category: 'Skipjack Tuna', minimumQuantity: '500g', price: 1200, image: IMG.skipjack, freshnessGrade: 'Daily Catch', availability: 'In Stock', description: 'Firm, flavourful skipjack tuna, a local favourite for curries and grilling.', sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }] },
  { id: '6', name: 'Indian Mackerel', localName: 'Kumbalawa', slug: 'indian-mackerel-kumbalawa', category: 'Indian Mackerel', minimumQuantity: '500g', price: 950, image: IMG.mackerel, freshnessGrade: 'Daily Catch', availability: 'In Stock', description: 'Fresh Indian Mackerel, cleaned and ready for cooking.', sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }] },
  { id: '7', name: 'Sail Fish', localName: 'Thalapath', slug: 'sail-fish-thalapath', category: 'Sail Fish', minimumQuantity: '500g', price: 1850, image: IMG.sailfish, freshnessGrade: 'Daily Catch', availability: 'In Stock', description: 'Prized sail fish steaks, firm texture, great for grilling.', sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }] },
  { id: '8', name: 'Seer Fish', localName: 'Surumai', slug: 'seer-fish-surumai', category: 'Seer Fish', minimumQuantity: '500g', price: 2600, image: IMG.seerfish, freshnessGrade: 'Export Grade', availability: 'In Stock', description: 'Premium Seer Fish steaks, boneless cuts available on request.', sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }] },
  { id: '9', name: 'Sardine', localName: 'Salaya', slug: 'sardine-salaya', category: 'Sardine', minimumQuantity: '500g', price: 650, image: IMG.sardine, freshnessGrade: 'Daily Catch', availability: 'In Stock', description: 'Small, oil-rich sardines, cleaned and iced fresh daily.', sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }] },
  { id: '10', name: 'Large Prawn', localName: 'Issa', slug: 'large-prawn-issa', category: 'Prawn', minimumQuantity: '500g', price: 2450, image: IMG.prawn, freshnessGrade: 'Lagoon Sourced', availability: 'In Stock', description: 'Jumbo Tiger Prawns, head-on, sourced fresh from Kalpitiya lagoon.', sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }] },
  { id: '11', name: 'Cuttle Fish', localName: 'Dallo', slug: 'cuttle-fish-dallo', category: 'Cuttle Fish', minimumQuantity: '500g', price: 1650, image: IMG.cuttlefish, freshnessGrade: 'Daily Catch', availability: 'In Stock', description: 'Cleaned cuttlefish tubes, tender and ready to cook.', sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }] },
  { id: '12', name: 'Squid', localName: 'Della', slug: 'squid-della', category: 'Squid', minimumQuantity: '500g', price: 1750, image: IMG.squid, freshnessGrade: 'Daily Catch', availability: 'In Stock', description: 'Fresh squid rings and tubes, cleaned and ready for cooking.', sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }] },
  { id: '13', name: 'Lobster', localName: 'Ibba Kakuluwa', slug: 'lobster-ibba-kakuluwa', category: 'Lobster', minimumQuantity: '500g', price: 4200, image: IMG.lobster, freshnessGrade: 'Export Grade', availability: 'In Stock', description: 'Live spiny rock lobster, graded by weight for premium dining.', sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }] },
  { id: '14', name: 'Mullet', localName: 'Godaya', slug: 'mullet-godaya', category: 'Mullet', minimumQuantity: '500g', price: 1100, image: IMG.mullet, freshnessGrade: 'Lagoon Sourced', availability: 'In Stock', description: 'Fresh lagoon mullet, mild flavour, great for frying or curry.', sizes: [{ label: '500g', priceMultiplier: 1 }, { label: '1kg', priceMultiplier: 1.9 }] },
];

export function formatLKR(amount) {
  return `Rs. ${Number(amount).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
}
