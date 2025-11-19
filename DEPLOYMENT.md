# SDG Donations Platform - Deployment Guide

## Backend Deployment (Render/Railway)

1. **Push code to GitHub**
2. **Connect to Render:**
   - New → Web Service
   - Connect your GitHub repo
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
3. **Environment Variables:**
   - MONGODB_URI=your_mongodb_atlas_connection_string
   - JWT_SECRET=your_jwt_secret_key
   - PAYSTACK_SECRET_KEY=your_paystack_live_secret_key
   - PAYSTACK_PUBLIC_KEY=your_paystack_live_public_key
   - FRONTEND_URL=your_frontend_domain
   - APP_URL=your_backend_domain

## Frontend Deployment (Vercel/Netlify)

1. **Build frontend:** `cd frontend && npm run build`
2. **Deploy to Vercel:**
   - Connect GitHub repo
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Environment Variables:**
   - VITE_API_URL=your_backend_domain

## MongoDB Atlas Setup

1. Create cluster at https://cloud.mongodb.com
2. Get connection string
3. Add IP whitelist for deployment services

## Paystack Webhook

1. In Paystack dashboard: Settings → Webhooks
2. Add URL: `your_backend_domain/api/paystack/webhook`