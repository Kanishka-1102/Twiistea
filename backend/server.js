require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const bannerRoutes = require('./routes/banners');
const uploadRoutes = require('./routes/upload');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

async function start() {
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('[local mode] No MONGODB_URI — starting in-memory MongoDB...');
    console.log('[local mode] First run may take a minute (Windows Defender scans new binary)');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({
      instance: { startupTimeout: 120000 },
    });
    mongoUri = mongod.getUri();
    console.log('[local mode] In-memory MongoDB ready');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');

  if (!process.env.MONGODB_URI) {
    await autoSeed();
  }

  app.listen(PORT, () => {
    console.log(`Twistea API running on port ${PORT}`);
    if (!process.env.MONGODB_URI) {
      console.log('[local mode] Admin login: admin@twistea.in / admin123');
      console.log('[local mode] Data resets on every restart');
    }
  });
}

async function autoSeed() {
  const User = require('./models/User');
  const Product = require('./models/Product');

  const adminExists = await User.findOne({ email: 'admin@twistea.in' });
  if (!adminExists) {
    await User.create({ name: 'Twistea Admin', email: 'admin@twistea.in', password: 'admin123', role: 'admin', phone: '+91 98765 43210' });
    console.log('[local mode] Admin seeded: admin@twistea.in / admin123');
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    const products = [
      {
        name: 'Darjeeling First Flush',
        description: 'The champagne of teas. Hand-picked from the highest elevations of the Darjeeling hills during the first harvest of the year.',
        shortDescription: 'Premium spring harvest from the Himalayas',
        category: 'tea', subCategory: 'Black Tea',
        price: 850, discountPrice: 699, stock: 50, weight: '100g',
        tags: ['darjeeling', 'first-flush', 'premium', 'organic'],
        ingredients: ['100% Darjeeling Tea Leaves'],
        brewingInstructions: 'Use 2g per 200ml. Water at 85°C. Steep 2-3 minutes.',
        isActive: true, isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&q=80', alt: 'Darjeeling First Flush', isPrimary: true }],
        ratings: { average: 4.8, count: 124 },
      },
      {
        name: 'Assam Gold CTC',
        description: 'Rich, robust, and full-bodied — the perfect morning tea from the lush Brahmaputra valley.',
        shortDescription: "Bold morning tea from Assam's finest gardens",
        category: 'tea', subCategory: 'Black Tea',
        price: 450, discountPrice: 379, stock: 100, weight: '250g',
        tags: ['assam', 'ctc', 'chai', 'strong'],
        ingredients: ['100% Assam CTC Tea'],
        brewingInstructions: 'Use 1 tsp per cup. Boil with milk and water 1:1. Simmer 3-4 minutes.',
        isActive: true, isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&q=80', alt: 'Assam Gold CTC', isPrimary: true }],
        ratings: { average: 4.6, count: 312 },
      },
      {
        name: 'Masala Chai Blend',
        description: 'Our signature Masala Chai — Assam tea with eight aromatic spices: ginger, cardamom, cinnamon, clove, black pepper, fennel, star anise, and nutmeg.',
        shortDescription: 'Aromatic blend with 8 traditional spices',
        category: 'tea', subCategory: 'Masala Chai',
        price: 599, stock: 75, weight: '200g',
        tags: ['masala', 'chai', 'spiced', 'bestseller'],
        ingredients: ['Assam Tea', 'Ginger', 'Cardamom', 'Cinnamon', 'Clove', 'Black Pepper', 'Fennel', 'Star Anise', 'Nutmeg'],
        brewingInstructions: 'Use 1.5 tsp per cup. Boil with equal parts water and milk. Simmer 5 minutes.',
        isActive: true, isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80', alt: 'Masala Chai', isPrimary: true }],
        ratings: { average: 4.9, count: 567 },
      },
      {
        name: 'Himalayan Green Tea',
        description: 'Sourced from high-altitude gardens in Sikkim — clean, grassy freshness with subtle sweet notes.',
        shortDescription: 'High-altitude organic green tea from Sikkim',
        category: 'tea', subCategory: 'Green Tea',
        price: 699, discountPrice: 589, stock: 40, weight: '100g',
        tags: ['green-tea', 'organic', 'sikkim', 'antioxidant'],
        ingredients: ['100% Green Tea Leaves (Sikkim)'],
        brewingInstructions: 'Use 1.5g per 150ml. Water at 75°C. Steep 1.5-2 minutes.',
        isActive: true, isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80', alt: 'Green Tea', isPrimary: true }],
        ratings: { average: 4.5, count: 89 },
      },
      {
        name: 'Kashmiri Kahwa',
        description: 'A warming blend from the valleys of Kashmir — green tea infused with saffron, cinnamon, cardamom, and shredded almonds.',
        shortDescription: 'Traditional Kashmiri saffron & almond blend',
        category: 'tea', subCategory: 'Herbal & Specialty',
        price: 1200, discountPrice: 999, stock: 25, weight: '100g',
        tags: ['kahwa', 'kashmiri', 'saffron', 'luxury'],
        ingredients: ['Green Tea', 'Saffron', 'Cinnamon', 'Cardamom', 'Almonds'],
        brewingInstructions: 'Use 1 tsp per cup. Steep in hot water for 4-5 minutes. Add honey.',
        isActive: true, isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80', alt: 'Kashmiri Kahwa', isPrimary: true }],
        ratings: { average: 4.7, count: 45 },
      },
      {
        name: 'Tulsi Ginger Herbal',
        description: 'A caffeine-free herbal infusion crafted from sacred Tulsi, fresh ginger, lemon grass, and mint.',
        shortDescription: 'Caffeine-free Tulsi & ginger immunity blend',
        category: 'tea', subCategory: 'Herbal & Specialty',
        price: 349, stock: 80, weight: '75g',
        tags: ['herbal', 'tulsi', 'caffeine-free', 'immunity'],
        ingredients: ['Tulsi Leaves', 'Ginger', 'Lemongrass', 'Mint', 'Black Pepper'],
        brewingInstructions: 'Use 1 tsp per cup. Steep in boiling water 5-7 minutes. Add honey and lemon.',
        isActive: true, isFeatured: false,
        images: [{ url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&q=80', alt: 'Herbal Tea', isPrimary: true }],
        ratings: { average: 4.4, count: 203 },
      },
      {
        name: 'Premium Ceramic Mug',
        description: 'Handcrafted in Jaipur — traditional Indian motifs inspired by blue pottery art. Each piece is unique, kiln-fired, food-safe glaze. Holds 300ml.',
        shortDescription: 'Handcrafted Jaipur blue pottery mug, 300ml',
        category: 'merchandise', subCategory: 'Mugs',
        price: 699, discountPrice: 599, stock: 30, weight: '400g',
        tags: ['mug', 'handcrafted', 'ceramic', 'jaipur'],
        isActive: true, isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80', alt: 'Ceramic Mug', isPrimary: true }],
        ratings: { average: 4.6, count: 78 },
      },
      {
        name: 'Twistea Gift Set — The Royal Collection',
        description: '5 celebrated teas in a beautiful wooden box — Darjeeling First Flush, Kashmiri Kahwa, Masala Chai, Himalayan Green, and Assam Gold.',
        shortDescription: '5 premium teas in a handcrafted wooden gift box',
        category: 'merchandise', subCategory: 'Gift Sets',
        price: 2499, discountPrice: 1999, stock: 15, weight: '600g',
        tags: ['gift', 'set', 'diwali', 'premium', 'corporate'],
        isActive: true, isFeatured: true,
        images: [{ url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80', alt: 'Gift Set', isPrimary: true }],
        ratings: { average: 5.0, count: 34 },
      },
    ];

    for (const p of products) {
      const prod = new Product(p);
      prod.slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
      await prod.save();
    }
    console.log(`[local mode] Seeded ${products.length} products`);
  }
}

start().catch(err => {
  console.error('Failed to start server:', err.stack || err.message);
  process.exit(1);
});
