const Product = require("../models/Product");

function escapeRegex(value) {
  return String(value)
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .slice(0, 80);
}

// GET /api/products?category=&search=&minPrice=&maxPrice=&sort=
async function getProducts(req, res, next) {
  try {
    const { category, search, minPrice, maxPrice, sort, featured } = req.query;
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
    if (minPrice || maxPrice) {
      const minimum = minPrice === undefined ? undefined : Number(minPrice);
      const maximum = maxPrice === undefined ? undefined : Number(maxPrice);
      if (minimum !== undefined && Number.isFinite(minimum) && minimum >= 0)
        filter.price = { $gte: minimum };
      if (maximum !== undefined && Number.isFinite(maximum) && maximum >= 0)
        filter.price = { ...(filter.price || {}), $lte: maximum };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: escapeRegex(search), $options: "i" } },
        { localName: { $regex: escapeRegex(search), $options: "i" } },
        { category: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }

    let query = Product.find(filter);
    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else query = query.sort({ createdAt: -1 });

    const [products, total] = await Promise.all([
      query.skip((page - 1) * limit).limit(limit),
      Product.countDocuments(filter),
    ]);
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

// GET /api/products/:slug
async function getProductBySlug(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
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
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
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
  deleteProduct,
  getCategories,
};
