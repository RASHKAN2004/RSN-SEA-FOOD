const Inquiry = require("../models/Inquiry");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

async function getDashboard(req, res, next) {
  try {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      orderCount,
      sales,
      monthlySales,
      orderStatuses,
      paymentStatuses,
      recentOrders,
      topProducts,
      productCount,
      productAvailability,
      lowStockProducts,
      customerCount,
      recentCustomers,
      inquiryCount,
      inquiryStatuses,
      recentInquiries,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$totalAmount" },
            paidOrders: { $sum: 1 },
            averageOrderValue: { $avg: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid", createdAt: { $gte: monthStart } } },
        { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Order.aggregate([
        { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
      ]),
      Order.find()
        .select(
          "orderNumber customer.name customer.email customer.phone shippingAddress.district totalAmount subtotal deliveryFee items.name items.quantityKg items.itemTotal paymentMethod paymentStatus orderStatus createdAt",
        )
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.name",
            quantityKg: { $sum: "$items.quantityKg" },
            revenue: {
              $sum: {
                $cond: [
                  { $eq: ["$paymentStatus", "paid"] },
                  "$items.itemTotal",
                  0,
                ],
              },
            },
          },
        },
        { $sort: { quantityKg: -1 } },
        { $limit: 5 },
      ]),
      Product.countDocuments(),
      Product.aggregate([
        { $group: { _id: "$availability", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Product.find({ stockKg: { $lte: 10 }, availability: { $ne: "Out of Stock" } })
        .select("name category stockKg availability image price")
        .sort({ stockKg: 1 })
        .limit(8)
        .lean(),
      User.countDocuments({ role: "customer" }),
      User.find({ role: "customer" })
        .select("name email phone createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Inquiry.countDocuments(),
      Inquiry.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Inquiry.find()
        .select("name phone whatsapp district message status createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    res.json({
      success: true,
      dashboard: {
        orders: {
          total: orderCount,
          paidRevenue: sales[0]?.revenue || 0,
          paidCount: sales[0]?.paidOrders || 0,
          averageOrderValue: sales[0]?.averageOrderValue || 0,
          monthRevenue: monthlySales[0]?.revenue || 0,
          statuses: orderStatuses,
          paymentStatuses,
          recent: recentOrders,
          topProducts,
        },
        products: {
          total: productCount,
          availability: productAvailability,
          lowStock: lowStockProducts,
        },
        customers: {
          total: customerCount,
          recent: recentCustomers,
        },
        inquiries: {
          total: inquiryCount,
          statuses: inquiryStatuses,
          recent: recentInquiries,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };
