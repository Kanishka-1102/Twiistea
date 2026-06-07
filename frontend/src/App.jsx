import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BannerStrip from './components/ui/BannerStrip';
import CartDrawer from './components/cart/CartDrawer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Account from './pages/Account';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminBanners from './pages/admin/AdminBanners';
import AdminMedia from './pages/admin/AdminMedia';
import AdminAnalytics from './pages/admin/AdminAnalytics';

function StorefrontLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <BannerStrip />
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#F5F1EA] py-16 px-4 text-center">
        <p className="text-[#B5821F] text-xs font-semibold tracking-[3px] uppercase mb-3">Our Story</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>From India, With Love</h1>
        <p className="text-[#777] text-lg max-w-xl mx-auto">From the heart of India, to your cup</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="text-[#555] leading-relaxed space-y-5 text-base">
          <p>Twistea was born from a simple belief — that every Indian deserves access to the finest, most authentic teas their land has to offer. Founded in the foothills of Darjeeling, we work directly with small-scale, family-owned tea gardens to bring you teas of exceptional quality and character.</p>
          <p>We started as a small stall at a local market in Kolkata in 2020. What began as a passion project — sharing our grandmother's masala chai recipe — has grown into a beloved tea brand trusted by over 10,000 families across India.</p>
          <p>Every blend we craft carries a piece of India's rich tea heritage. From the delicate muscatel notes of our Darjeeling First Flush to the robust, malty warmth of our Assam Gold, each cup is a journey through India's most celebrated tea-growing regions.</p>
          <p>We are proud to be 100% natural, certified organic, and committed to fair trade practices that support the farmers who make our teas possible.</p>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center text-center px-4">
      <div>
        <p className="text-7xl mb-6">🍵</p>
        <h1 className="font-bold text-4xl text-[#1a1a1a] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Page Not Found</h1>
        <p className="text-[#999] mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" className="btn-primary inline-flex">Go Home</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { fontFamily: 'Inter, sans-serif', fontSize: '14px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
        success: { style: { background: '#f0f7f3', border: '1px solid #bcdcca', color: '#1a4a2e' } },
        error: { style: { background: '#fff5f5', border: '1px solid #fecaca', color: '#b91c1c' } },
      }} />
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
        <Route path="/products" element={<StorefrontLayout><Products /></StorefrontLayout>} />
        <Route path="/products/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
        <Route path="/checkout" element={<StorefrontLayout><Checkout /></StorefrontLayout>} />
        <Route path="/about" element={<StorefrontLayout><About /></StorefrontLayout>} />
        <Route path="/account/*" element={<StorefrontLayout><Account /></StorefrontLayout>} />
        <Route path="*" element={<StorefrontLayout><NotFound /></StorefrontLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
