const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: {
    url: { type: String, required: true },
    publicId: String,
  },
  link: { type: String },
  position: { type: String, enum: ['hero', 'top', 'middle', 'popup'], default: 'hero' },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date },
  priority: { type: Number, default: 0 },
  backgroundColor: { type: String, default: '#1a4a2e' },
  textColor: { type: String, default: '#ffffff' },
  ctaText: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

bannerSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Banner', bannerSchema);
