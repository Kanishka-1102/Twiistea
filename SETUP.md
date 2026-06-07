# Twistea Setup Guide

## Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free tier is fine)

## 1. Configure Environment Variables

### Backend (`backend/.env`)
Fill in your Cloudinary credentials:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGODB_URI=mongodb://localhost:27017/twistea
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

## 2. Install Dependencies
```powershell
cd backend; npm install
cd ../frontend; npm install
```

## 3. Seed the Database
```powershell
cd backend; node seed.js
```
This creates:
- Admin: admin@twistea.in / admin123
- 8 sample products (teas + merchandise)

## 4. Start Development Servers

**Terminal 1 — Backend:**
```powershell
cd backend; npm run dev
```

**Terminal 2 — Frontend:**
```powershell
cd frontend; npm run dev
```

## 5. Open the App
- **Store:** http://localhost:5173
- **Admin:** http://localhost:5173/admin

## Admin Credentials
- Email: `admin@twistea.in`
- Password: `admin123`

## What's Included

### Customer Side
- Landing page with hero, categories, featured products, testimonials
- Product listing with filters (category, sort, search, pagination)
- Product detail with image gallery, reviews, add to cart
- Cart drawer with quantity controls
- Full checkout flow (address → payment → confirmation)
- User account (profile, order history)
- Login / Register
- Configurable banners (top strip)

### Admin Panel (`/admin`)
- **Dashboard:** Revenue, orders, charts
- **Orders:** View all orders, update dispatch status, process returns
- **Products:** Add/edit/delete with multiple image upload to Cloudinary
- **Banners:** Create promotional banners with expiry dates
- **Site Images:** Replace every image on the site (hero, categories, etc.)
- **Analytics:** Monthly revenue vs returns vs profit charts, category breakdown

## Cloudinary Setup
1. Create free account at cloudinary.com
2. Copy Cloud Name, API Key, API Secret from dashboard
3. Paste into `backend/.env`
