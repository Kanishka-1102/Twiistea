const path = require('path');
const fs = require('fs');
const multer = require('multer');

const useLocal = !process.env.CLOUDINARY_CLOUD_NAME;

if (useLocal) {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      cb(null, name);
    },
  });

  const BASE = process.env.UPLOADS_BASE_URL || 'http://localhost:5000';

  function patchPaths(req, res, next) {
    if (req.file) req.file.path = `${BASE}/uploads/${req.file.filename}`;
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(f => { f.path = `${BASE}/uploads/${f.filename}`; });
    }
    next();
  }

  const base = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

  const upload = {
    single: (field) => (req, res, next) => {
      base.single(field)(req, res, (err) => {
        if (err) return next(err);
        patchPaths(req, res, next);
      });
    },
    array: (field, max) => (req, res, next) => {
      base.array(field, max)(req, res, (err) => {
        if (err) return next(err);
        patchPaths(req, res, next);
      });
    },
  };

  const cloudinary = {
    uploader: {
      destroy: async (publicId) => {
        // publicId in local mode is the bare filename
        try { fs.unlinkSync(path.join(uploadsDir, publicId)); } catch (_) {}
        return { result: 'ok' };
      },
    },
  };

  module.exports = { cloudinary, upload };
} else {
  const cloudinaryLib = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinaryLib.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinaryLib,
    params: async (req, file) => ({
      folder: req.body.folder || 'twistea/products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    }),
  });

  const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

  module.exports = { cloudinary: cloudinaryLib, upload };
}
