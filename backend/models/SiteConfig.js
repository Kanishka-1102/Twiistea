const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: { type: mongoose.Schema.Types.Mixed },
  label: String,
  type: { type: String, enum: ['text', 'image', 'json', 'boolean', 'number'], default: 'text' },
}, { timestamps: true });

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
