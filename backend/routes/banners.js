const express = require('express');
const Banner = require('../models/Banner');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const banners = await Banner.find({
      isActive: true,
      $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }],
    }).sort({ priority: -1, createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Banner image required' });
    const { title, subtitle, link, position, expiresAt, priority, backgroundColor, textColor, ctaText } = req.body;
    const banner = await Banner.create({
      title, subtitle, link, position, priority: Number(priority) || 0,
      backgroundColor, textColor, ctaText,
      image: { url: req.file.path, publicId: req.file.filename },
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: req.user._id,
    });
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    const updateData = { ...req.body };
    if (req.file) {
      if (banner.image.publicId) await cloudinary.uploader.destroy(banner.image.publicId);
      updateData.image = { url: req.file.path, publicId: req.file.filename };
    }
    if (updateData.expiresAt) updateData.expiresAt = new Date(updateData.expiresAt);
    if (updateData.priority) updateData.priority = Number(updateData.priority);

    const updated = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    if (banner.image.publicId) await cloudinary.uploader.destroy(banner.image.publicId);
    await banner.deleteOne();
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
