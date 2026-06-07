const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12, featured } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];

    const sortOptions = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      popular: { 'ratings.average': -1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }], isActive: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed' });
    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    product.ratings.count = product.reviews.length;
    product.ratings.average = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin routes
router.post('/', protect, adminOnly, upload.array('images', 10), async (req, res) => {
  try {
    const { name, description, shortDescription, category, subCategory, price, discountPrice, stock, tags, weight, dimensions, ingredients, brewingInstructions, isActive, isFeatured } = req.body;
    const images = req.files?.map((file, idx) => ({
      url: file.path,
      publicId: file.filename,
      alt: name,
      isPrimary: idx === 0,
    })) || [];

    const product = await Product.create({
      name, description, shortDescription, category, subCategory,
      price: Number(price), discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock) || 0, tags: tags ? tags.split(',').map(t => t.trim()) : [],
      weight, dimensions, ingredients: ingredients ? ingredients.split(',').map(i => i.trim()) : [],
      brewingInstructions, images,
      isActive: isActive !== 'false', isFeatured: isFeatured === 'true',
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, adminOnly, upload.array('images', 10), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newImages = req.files?.map((file, idx) => ({
      url: file.path,
      publicId: file.filename,
      alt: req.body.name || product.name,
      isPrimary: idx === 0 && product.images.length === 0,
    })) || [];

    const { removeImages } = req.body;
    let existingImages = product.images;
    if (removeImages) {
      const toRemove = JSON.parse(removeImages);
      for (const publicId of toRemove) {
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
      existingImages = existingImages.filter(img => !toRemove.includes(img.publicId));
    }

    const updateData = { ...req.body };
    delete updateData.removeImages;
    if (updateData.tags) updateData.tags = updateData.tags.split(',').map(t => t.trim());
    if (updateData.ingredients) updateData.ingredients = updateData.ingredients.split(',').map(i => i.trim());
    updateData.images = [...existingImages, ...newImages];

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    for (const img of product.images) {
      if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
