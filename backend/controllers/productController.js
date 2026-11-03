const Product = require("../models/Product");
const {
  getPriceForDate,
  getSriLankaDate,
  isValidDateKey,
} = require("../utils/productPricing");

function escapeRegex(value) {
  return String(value)
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .slice(0, 80);
}

// GET /api/products?category=&search=&minPrice=&maxPrice=&sort=
async function getProducts(req, res, next) {
  try {
    const { category, search, minPrice, maxPrice, sort, featured } = req.query;
    const priceDate = req.query.priceDate || getSriLankaDate();
    if (!isValidDateKey(priceDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid price date. Use YYYY-MM-DD.",
      });
    }
    const page = Math.max(
      1,
      Math.min(1000, Number.parseInt(req.query.page || "1", 10) || 1),
    );
    const limit = Math.max(
      1,
      Math.min(50, Number.parseInt(req.query.limit || "24", 10) || 24),
    );
    const filter = {};
    if (category) filter.category = category;
    if (featured) filter.featured = featured === "true";
    if (search) {
      filter.$or = [
        { name: { $regex: escapeRegex(search), $options: "i" } },
        { localName: { $regex: escapeRegex(search), $options: "i" } },
        { category: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }

    const normalizedSort = (sort || "").replace(/-/g, "_");
    const minimumPrice =
      minPrice !== undefined && minPrice !== "" ? Number(minPrice) : null;
    const maximumPrice =
      maxPrice !== undefined && maxPrice !== "" ? Number(maxPrice) : null;
    const hasPriceFilter =
      (Number.isFinite(minimumPrice) && minimumPrice >= 0) ||
      (Number.isFinite(maximumPrice) && maximumPrice >= 0);
    const sortByPrice = ["price_asc", "price_desc"].includes(normalizedSort);
    let products;
    let total;

    if (hasPriceFilter || sortByPrice) {
      const candidates = (await Product.find(filter).sort({ createdAt: -1 }))
        .map((product) => ({
          ...product.toObject(),
          price: getPriceForDate(product, priceDate),
        }))
        .filter(
          (product) =>
            (!Number.isFinite(minimumPrice) ||
              minimumPrice < 0 ||
              product.price >= minimumPrice) &&
            (!Number.isFinite(maximumPrice) ||
              maximumPrice < 0 ||
              product.price <= maximumPrice),
        );
      if (normalizedSort === "price_asc") {
        candidates.sort((left, right) => left.price - right.price);
      } else if (normalizedSort === "price_desc") {
        candidates.sort((left, right) => right.price - left.price);
      }
      total = candidates.length;
      products = candidates.slice((page - 1) * limit, page * limit);
    } else {
      const [pageProducts, productTotal] = await Promise.all([
        Product.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit),
        Product.countDocuments(filter),
      ]);
      products = pageProducts.map((product) => ({
        ...product.toObject(),
        price: getPriceForDate(product, priceDate),
      }));
      total = productTotal;
    }

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      limit,
      products,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:slug (supports slug or MongoDB ObjectId)
async function getProductBySlug(req, res, next) {
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.slug);
    const filter = isObjectId
      ? { $or: [{ slug: req.params.slug }, { _id: req.params.slug }] }
      : { slug: req.params.slug };
    const product = await Product.findOne(filter);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({
      success: true,
      product: {
        ...product.toObject(),
        price: getPriceForDate(product),
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/products (admin)
async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id (admin)
async function updateProduct(req, res, next) {
  try {
    const updates = { ...req.body };
    if (Object.prototype.hasOwnProperty.call(updates, "price")) {
      const effectiveDate = getSriLankaDate();
      const effectivePrice = updates.price;
      delete updates.price;
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }
      const priceHistory = product.priceHistory.filter(
        (entry) => entry.effectiveDate !== effectiveDate,
      );
      priceHistory.push({ effectiveDate, price: effectivePrice });
      updates.priceHistory = priceHistory;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id/price (admin)
async function setProductPrice(req, res, next) {
  try {
    const { effectiveDate, price } = req.body || {};
    if (
      !isValidDateKey(effectiveDate) ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid date (YYYY-MM-DD) and non-negative price are required.",
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    const priceHistory = product.priceHistory.filter(
      (entry) => entry.effectiveDate !== effectiveDate,
    );
    priceHistory.push({ effectiveDate, price });
    product.priceHistory = priceHistory;
    await product.save();

    res.json({
      success: true,
      product: {
        ...product.toObject(),
        price: getPriceForDate(product, effectiveDate),
      },
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/products/:id (admin)
async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/meta/categories
async function getCategories(req, res, next) {
  try {
    const categories = await Product.distinct("category");
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  setProductPrice,
  deleteProduct,
  getCategories,
};
