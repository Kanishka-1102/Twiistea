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
import About from './pages/About';
import NotFound from './pages/NotFound';

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
