const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, payment, notes } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Order items required' });

    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      const price = product.discountPrice || product.price;
      const total = price * item.quantity;
      subtotal += total;
      orderItems.push({ product: product._id, name: product.name, image: product.images[0]?.url, price, quantity: item.quantity, total });
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
    }

    const shipping = subtotal >= 500 ? 0 : 60;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      pricing: { subtotal, shipping, tax, total },
      payment: { method: payment?.method || 'cod', status: payment?.method === 'cod' ? 'pending' : 'pending' },
      notes,
      statusHistory: [{ status: 'placed', note: 'Order placed successfully' }],
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/my/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!['placed', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: req.body.reason || 'Cancelled by customer', updatedBy: req.user._id });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin routes
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search, startDate, endDate } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.orderNumber = { $regex: search, $options: 'i' };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/analytics', protect, adminOnly, async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${year}-12-31T23:59:59`);

    const monthlySales = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear }, status: { $nin: ['cancelled'] } } },
      { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$pricing.total' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const returns = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear }, isReturned: true } },
      { $group: { _id: { $month: '$createdAt' }, amount: { $sum: '$refundAmount' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const categoryRevenue = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $group: { _id: '$product.category', revenue: { $sum: '$items.total' }, count: { $sum: '$items.quantity' } } },
    ]);

    const statusBreakdown = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const totals = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' }, totalOrders: { $sum: 1 }, totalReturns: { $sum: { $cond: ['$isReturned', '$refundAmount', 0] } } } },
    ]);

    res.json({ monthlySales, returns, categoryRevenue, statusBreakdown, totals: totals[0] || {} });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone').populate('items.product', 'name images');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note, tracking } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    order.statusHistory.push({ status, note, updatedBy: req.user._id });
    if (tracking) order.tracking = { ...order.tracking, ...tracking };
    if (status === 'delivered') order.payment.status = 'paid';
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/return', protect, adminOnly, async (req, res) => {
  try {
    const { refundAmount, reason } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.isReturned = true;
    order.returnReason = reason;
    order.refundAmount = refundAmount;
    order.payment.status = 'refunded';
    order.status = 'returned';
    order.statusHistory.push({ status: 'returned', note: `Return processed. Refund: ₹${refundAmount}`, updatedBy: req.user._id });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
