const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');
const SiteConfig = require('../models/SiteConfig');

const router = express.Router();

router.post('/site-image', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
    const { configKey, label } = req.body;
    if (configKey) {
      const existing = await SiteConfig.findOne({ key: configKey });
      if (existing?.value?.publicId) await cloudinary.uploader.destroy(existing.value.publicId);
      await SiteConfig.findOneAndUpdate(
        { key: configKey },
        { key: configKey, value: { url: req.file.path, publicId: req.file.filename }, label: label || configKey, type: 'image' },
        { upsert: true, new: true }
      );
    }
    res.json({ url: req.file.path, publicId: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/site-config', async (req, res) => {
  try {
    const configs = await SiteConfig.find();
    const result = {};
    for (const c of configs) result[c.key] = c.value;
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/site-config/:key', protect, adminOnly, async (req, res) => {
  try {
    const { value, label, type } = req.body;
    const config = await SiteConfig.findOneAndUpdate(
      { key: req.params.key },
      { value, label, type },
      { upsert: true, new: true }
    );
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/cloudinary/:publicId', protect, adminOnly, async (req, res) => {
  try {
    const decoded = decodeURIComponent(req.params.publicId);
    await cloudinary.uploader.destroy(decoded);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
