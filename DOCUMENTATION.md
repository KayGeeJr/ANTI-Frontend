# ANTI Store — Full Technical Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Project Structure](#4-project-structure)
5. [Environment Variables](#5-environment-variables)
6. [Local Development Setup](#6-local-development-setup)
7. [Frontend Pages & Routes](#7-frontend-pages--routes)
8. [Backend API Reference](#8-backend-api-reference)
9. [Database Models](#9-database-models)
10. [Key Business Processes](#10-key-business-processes)
11. [Authentication & Security](#11-authentication--security)
12. [Payments — PayFast Integration](#12-payments--payfast-integration)
13. [Media — Cloudinary Integration](#13-media--cloudinary-integration)
14. [Email System](#14-email-system)
15. [Admin Dashboard](#15-admin-dashboard)
16. [Deployment](#16-deployment)
17. [Third-Party Services](#17-third-party-services)
18. [Known Limitations & Future Work](#18-known-limitations--future-work)

---

## 1. Project Overview

ANTI Store is a full-stack e-commerce platform built for the ANTI fashion brand. It allows customers to browse collections, purchase clothing, and track their orders, while giving the store owner a complete admin dashboard to manage products, categories, inventory, and orders.

**Live domains:**
- Frontend: `https://shopanti.online` (Vercel / Netlify)
- Backend API: Railway (Express server)

**Core capabilities:**
- Product catalogue with size variants and per-size stock management
- Guest and authenticated checkout (EFT manual + PayFast card/EFT)
- Order management with email notifications
- Custom order / bespoke inquiry form
- Newsletter subscription
- Full admin dashboard (products, categories, orders, inventory)
- Forgot password / email-based password reset

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14.2.5 | React framework, App Router, SSR/ISR |
| React | 18.3.1 | UI library |
| Tailwind CSS | 3.4.10 | Utility-first styling |
| PostCSS / Autoprefixer | 8.4 / 10.4 | CSS processing |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | LTS | Runtime |
| Express | 5.2.1 | HTTP server framework |
| Mongoose | 9.5.0 | MongoDB ODM |
| bcryptjs | 3.0.3 | Password hashing |
| jsonwebtoken | 9.0.3 | JWT auth tokens |
| multer | 2.1.1 | File upload handling |
| multer-storage-cloudinary | 4.0.0 | Direct-to-Cloudinary uploads |
| cloudinary | 1.41.3 | Media storage SDK |
| nodemailer | 8.0.5 | Transactional email |
| express-rate-limit | 8.3.2 | Rate limiting |
| helmet | 8.1.0 | HTTP security headers |
| morgan | 1.10.1 | HTTP request logging |
| cors | 2.8.6 | Cross-origin resource sharing |
| dotenv | 17.4.2 | Environment variable loading |

### Infrastructure
| Service | Purpose |
|---|---|
| MongoDB Atlas | Hosted database |
| Cloudinary | Image and video CDN storage |
| Railway | Backend hosting |
| Vercel / Netlify | Frontend hosting |
| PayFast | Payment gateway (South Africa) |
| Nodemailer / SMTP | Transactional email delivery |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Customer Browser                    │
└────────────────────────┬────────────────────────────────┘
                         │  HTTPS
┌────────────────────────▼────────────────────────────────┐
│              Next.js Frontend (Vercel/Netlify)          │
│  - App Router (src/app/)                                │
│  - Client components fetch via /api-proxy rewrite       │
│  - Server components fetch directly at build time       │
└────────────────────────┬────────────────────────────────┘
                         │  /api-proxy/* → BACKEND_URL/api/*
┌────────────────────────▼────────────────────────────────┐
│             Express Backend (Railway)                   │
│  - REST API at /api/*                                   │
│  - JWT authentication                                   │
│  - Multer → Cloudinary for media uploads                │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
┌──────────▼──────────┐  ┌────────────▼────────────────────┐
│   MongoDB Atlas     │  │         Cloudinary CDN           │
│   (all app data)    │  │   (product images, cat videos)   │
└─────────────────────┘  └─────────────────────────────────┘

PayFast Payment Flow:
  Browser → POST /api/payment/initiate → receives form data
  Browser → submits hidden form to payfast.co.za
  PayFast → POST BACKEND_URL/api/payment/notify (server-to-server IPN)
  PayFast → redirects browser to /checkout/success?custom_str1=ORDER_NUMBER
```

### API Proxy
The Next.js `next.config.js` rewrites `/api-proxy/:path*` to `${BACKEND_URL}/api/:path*`. The frontend always calls `/api-proxy/...` and never has the backend URL hardcoded in client bundles.

```js
// next.config.js
rewrites: () => [{
  source: "/api-proxy/:path*",
  destination: `${process.env.BACKEND_URL}/api/:path*`
}]
```

---

## 4. Project Structure

```
ANTI/
├── src/                          # Next.js frontend
│   ├── app/                      # App Router pages
│   │   ├── page.js               # Homepage
│   │   ├── layout.js             # Root layout (fonts, nav, footer)
│   │   ├── shop/page.js          # Product listing
│   │   ├── product/[slug]/       # Product detail page
│   │   ├── category/[slug]/      # Category page
│   │   ├── cart/page.js          # Shopping cart
│   │   ├── checkout/
│   │   │   ├── page.js           # Checkout form
│   │   │   └── success/page.js   # Post-payment confirmation
│   │   ├── account/
│   │   │   ├── page.js           # Login / register / profile
│   │   │   ├── forgot-password/  # Request reset link
│   │   │   └── reset-password/   # Set new password
│   │   ├── admin/page.js         # Admin dashboard (SPA)
│   │   ├── about/page.js
│   │   ├── contact/page.js
│   │   ├── custom-orders/page.js
│   │   ├── not-found.js          # 404 page
│   │   └── error.js              # Global error boundary
│   ├── components/               # Shared React components
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── ProductCard.js
│   │   ├── ProductDetails.js     # Product page body
│   │   ├── VariantSelector.js    # Size / colour picker
│   │   ├── HomepageCollections.js
│   │   ├── CategoryCarousel.js
│   │   ├── NewsletterForm.js
│   │   └── LogoLoader.js
│   ├── lib/
│   │   ├── api.js                # All frontend API calls
│   │   └── pricing.js            # formatRand helper
│   └── data/
│       └── mockCatalog.js        # Fallback data if API unreachable
│
├── backend/
│   ├── server.js                 # Express entry point
│   ├── config/
│   │   ├── db.js                 # Mongoose connection
│   │   └── cloudinary.js         # Cloudinary SDK config
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Collection.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   ├── CustomOrder.js
│   │   └── Newsletter.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── collection.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── payment.controller.js
│   │   ├── customOrder.controller.js
│   │   ├── newsletter.controller.js
│   │   └── admin.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── collection.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   ├── payment.routes.js
│   │   ├── customOrder.routes.js
│   │   ├── newsletter.routes.js
│   │   └── admin.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── admin.middleware.js
│   │   ├── optionalAuth.middleware.js
│   │   ├── upload.middleware.js
│   │   └── errorHandler.js
│   └── utils/
│       ├── generateToken.js
│       ├── payfastSignature.js
│       ├── sendEmail.js
│       └── asyncHandler.js
│
├── .env.local                    # Frontend env vars (never commit)
├── backend/.env                  # Backend env vars (never commit)
├── next.config.js
├── railway.json                  # Railway deployment config
├── tailwind.config.js
└── DOCUMENTATION.md              # This file
```

---

## 5. Environment Variables

### Frontend — `.env.local`

| Variable | Value | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `/api-proxy` | Prefix for all API calls from browser |

### Backend — `backend/.env`

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret key for signing JWTs — must be long and random |
| `JWT_EXPIRES_IN` | No | Token lifetime, default `30d` |
| `PORT` | No | Server port, default `5000` |
| `NODE_ENV` | Yes | `production` or `development` |
| `FRONTEND_URL` | Yes | Full URL of frontend, e.g. `https://shopanti.online` |
| `BACKEND_URL` | Yes | Full URL of backend, e.g. `https://anti-api.up.railway.app` |
| `CLOUDINARY_CLOUD_NAME` | Yes | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Yes | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Yes | From Cloudinary dashboard |
| `PAYFAST_MERCHANT_ID` | Yes | From PayFast merchant account |
| `PAYFAST_MERCHANT_KEY` | Yes | From PayFast merchant account |
| `PAYFAST_PASSPHRASE` | Yes | Set in PayFast merchant settings |
| `PAYFAST_SANDBOX` | Yes | `true` for testing, `false` for live payments |
| `EMAIL_HOST` | Yes | SMTP host, e.g. `smtp.gmail.com` |
| `EMAIL_PORT` | Yes | SMTP port, e.g. `587` |
| `EMAIL_USER` | Yes | SMTP username / sender address |
| `EMAIL_PASS` | Yes | SMTP password or app password |

> **Security rule:** Neither `.env.local` nor `backend/.env` should ever be committed to version control. Both are in `.gitignore`. In production, all variables are set directly in Railway (backend) and Vercel/Netlify (frontend) dashboards.

---

## 6. Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- PayFast sandbox account (optional for local dev)

### Step 1 — Clone and install

```bash
git clone https://github.com/KayGeeJr/ANTI-Frontend.git
cd ANTI

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### Step 2 — Configure environment variables

Create `backend/.env` with all variables from Section 5. Set `PAYFAST_SANDBOX=true` and `NODE_ENV=development`.

Create `.env.local` in the root:
```
NEXT_PUBLIC_API_BASE_URL=/api-proxy
```

Set `BACKEND_URL=http://localhost:5001` in `.env.local` for local proxying:
```
NEXT_PUBLIC_API_BASE_URL=/api-proxy
BACKEND_URL=http://localhost:5001
```

### Step 3 — Seed the database (optional)

```bash
cd backend && npm run seed
```

### Step 4 — Create an admin account

```bash
cd backend && npm run promote-admin
# Follow the prompts to set isAdmin: true on a user
```

### Step 5 — Run both servers

```bash
# Terminal 1 — backend
cd backend && npm run dev   # runs on port 5001 (or PORT env var)

# Terminal 2 — frontend
npm run dev                 # runs on http://localhost:3000
```

The frontend dev server proxies `/api-proxy/*` to `http://localhost:5001/api/*` automatically via `next.config.js`.

---

## 7. Frontend Pages & Routes

| Route | Type | Description |
|---|---|---|
| `/` | Server (ISR) | Homepage — hero, collections, featured products, newsletter |
| `/shop` | Client | Full product catalogue with search and filters |
| `/product/[slug]` | Server (dynamic) | Product detail page — images, variants, add to cart |
| `/category/[slug]` | Server (dynamic) | Products filtered by category |
| `/cart` | Client | Cart items, quantities, totals |
| `/checkout` | Client | Shipping form, order summary, payment method selection |
| `/checkout/success` | Client | Order confirmation after PayFast redirect |
| `/account` | Client | Login / register, profile, order history |
| `/account/forgot-password` | Client | Request password reset email |
| `/account/reset-password` | Client | Set new password via token from email |
| `/admin` | Client | Full admin dashboard (auth-gated) |
| `/about` | Static | Brand story |
| `/contact` | Static | Contact details |
| `/custom-orders` | Client | Bespoke garment request form |
| `/not-found` | Static | 404 page |
| `/error` | Client | Runtime error boundary |

### How the API proxy works in the browser

All `api.js` functions call `/api-proxy/...`. In development, Next.js rewrites this to `http://localhost:5001/api/...`. In production, it rewrites to `https://your-api.railway.app/api/...`. The actual backend URL is never exposed in the browser bundle.

---

## 8. Backend API Reference

Base URL: `https://your-api.railway.app/api`

Authentication: `Authorization: Bearer <jwt_token>`

All responses follow the shape `{ success: true, ...data }` or `{ success: false, message: "..." }`.

Prices are always in **cents** (e.g. R600.00 is stored as `60000`).

---

### Auth — `/api/auth`

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| POST | `/register` | — | 5/hr | Register new user |
| POST | `/login` | — | 10/15min | Login, returns JWT |
| GET | `/me` | Required | — | Get current user |
| PUT | `/update-profile` | Required | — | Update name / phone |
| PUT | `/change-password` | Required | — | Change password (requires current password) |
| POST | `/address` | Required | — | Add shipping address |
| PUT | `/address/:id` | Required | — | Update address |
| DELETE | `/address/:id` | Required | — | Delete address |
| POST | `/forgot-password` | — | 5/hr | Send reset link to email |
| POST | `/reset-password` | — | — | Reset password with token |

**Register body:**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "Secret123" }
```
Password must be min 8 chars, with at least one uppercase, one lowercase, one number.

**Login body:**
```json
{ "email": "jane@example.com", "password": "Secret123" }
```

**Forgot password body:**
```json
{ "email": "jane@example.com" }
```
Always returns success (never reveals if email is registered).

**Reset password body:**
```json
{ "token": "<token_from_email_link>", "password": "NewSecret123" }
```
Token expires after 1 hour.

---

### Products — `/api/products`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | — | List products. Query: `?page=1&limit=12&sort=newest&category=id&search=term` |
| GET | `/:slug` | — | Get single product by slug |
| POST | `/` | Admin | Create product (multipart/form-data, up to 8 images) |
| PUT | `/:id` | Admin | Update product (multipart/form-data) |
| DELETE | `/:id` | Admin | Soft-delete (sets `isActive: false`) |
| PUT | `/:id/stock` | Admin | Update stock for a specific variant index |
| POST | `/:id/wishlist` | Required | Toggle product on/off user's wishlist |

**Create / update product fields:**
```
name, description, price (in cents), category (ObjectId), collection (ObjectId),
tags (JSON array string), variants (JSON array), images (files), keepImageUrls (JSON array)
```

**Variants format:**
```json
[
  { "size": "XS", "stock": 10, "colour": "Black", "sku": "ANTI-XS" },
  { "size": "S",  "stock": 8,  "colour": "Black", "sku": "ANTI-S"  },
  { "size": "M",  "stock": 5,  "colour": "Black", "sku": "ANTI-M"  },
  { "size": "L",  "stock": 3,  "colour": "Black", "sku": "ANTI-L"  },
  { "size": "XL", "stock": 0,  "colour": "Black", "sku": "ANTI-XL" }
]
```

---

### Categories — `/api/categories`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | — | List all active categories |
| GET | `/:slug` | — | Get category + its products |
| POST | `/` | Admin | Create category (image + video upload) |
| PUT | `/:id` | Admin | Update category |
| DELETE | `/:id` | Admin | Soft-delete |

**Create / update category fields:**
```
name, description, image (file), video (file or URL),
removeImage (true/false), removeVideo (true/false)
```

---

### Collections — `/api/collections`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | — | List all active collections |
| GET | `/:slug` | — | Get collection + its products |
| POST | `/` | Admin | Create collection (single image) |
| PUT | `/:id` | Admin | Update collection |
| DELETE | `/:id` | Admin | Soft-delete |

---

### Cart — `/api/cart`

Guest carts are identified by `x-session-id` header (set automatically by `api.js`). Logged-in carts are identified by JWT.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Optional | Get cart (user or guest) |
| POST | `/add` | Optional | Add item — checks stock before adding |
| PUT | `/update` | Optional | Update item quantity — checks stock |
| DELETE | `/item/:itemId` | Optional | Remove item |
| DELETE | `/clear` | Optional | Empty cart |
| POST | `/merge` | Required | Merge guest cart into logged-in user cart |

**Add to cart body:**
```json
{ "productId": "...", "variantIndex": 0, "quantity": 1 }
```

`variantIndex` refers to the position of the variant in the product's `variants` array (0 = XS, 1 = S, 2 = M, 3 = L, 4 = XL by convention).

---

### Orders — `/api/orders`

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| POST | `/` | Optional | 10/15min | Create order from cart |
| GET | `/my-orders` | Required | — | Get logged-in user's orders |
| GET | `/:orderNumber` | Optional | — | Get order by number (owner or admin only) |
| PUT | `/:id/cancel` | Required | — | Cancel a processing order (restores stock) |

**Create order body:**
```json
{
  "shippingAddress": {
    "name": "Jane Doe",
    "street": "123 Main St",
    "city": "Johannesburg",
    "province": "Gauteng",
    "postalCode": "2001",
    "country": "South Africa",
    "phone": "0821234567"
  },
  "paymentMethod": "payfast",
  "guestEmail": "jane@example.com"
}
```

On order creation:
1. Cart is validated (all products active, all variants in stock)
2. Stock is decremented atomically per variant using MongoDB `$inc`
3. Order is created with `paymentStatus: "pending"`
4. For EFT orders, cart is cleared immediately and confirmation email sent
5. For PayFast orders, cart is cleared by the IPN webhook after payment confirmation

---

### Payment — `/api/payment`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/initiate` | Optional | Build PayFast form data and return it |
| POST | `/notify` | — (PayFast server) | PayFast IPN webhook — marks order paid |
| GET | `/success` | — | Redirect target after successful payment |
| GET | `/cancel` | — | Redirect target after cancelled payment |

**Initiate payment body:**
```json
{ "orderId": "...", "guestEmail": "jane@example.com" }
```

The frontend receives `{ payfastUrl, paymentData }` and submits a hidden HTML form to PayFast directly from the browser.

---

### Custom Orders — `/api/custom-orders`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | — | Submit a custom order inquiry (up to 5 reference images) |
| GET | `/` | Admin | List all custom orders |
| PUT | `/:id` | Admin | Update status / admin notes |

---

### Newsletter — `/api/newsletter`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/subscribe` | — | Subscribe email to newsletter |
| GET | `/subscribers` | Admin | List all subscribers |
| DELETE | `/unsubscribe` | — | Unsubscribe by email |

---

### Admin — `/api/admin`

All routes require authentication + `isAdmin: true`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Revenue, order counts, low stock alerts |
| GET | `/orders` | All orders with pagination and filters |
| PUT | `/orders/:id` | Update order status / tracking number |
| GET | `/users` | All registered users |
| GET | `/inventory` | All products with variant stock levels |

---

## 9. Database Models

### User
```
name          String    required
email         String    required, unique, lowercase
password      String    required, bcrypt hashed, hidden from queries
phone         String
isAdmin       Boolean   default false
addresses     [{
  label, street, city, province, postalCode,
  country (default "South Africa"), isDefault
}]
wishlist      [ObjectId → Product]
resetPasswordToken    String  hidden from queries
resetPasswordExpires  Date    hidden from queries
```

### Product
```
name          String    required
slug          String    unique, auto-generated from name
description   String    required
price         Number    required, in cents (R600 = 60000)
compareAtPrice Number   optional, in cents
category      ObjectId → Category   required
collection    ObjectId → Collection
images        [{ url: String, publicId: String }]
variants      [{
  size    String
  colour  String
  stock   Number   default 0
  sku     String
}]
tags          [String]
isFeatured    Boolean   default false
isActive      Boolean   default true  (soft delete)
```
Virtual: `totalStock` — sum of all `variants[].stock`

### Category
```
name          String    required, unique
slug          String    unique, auto-generated
description   String
image         { url, publicId }
video         String    Cloudinary URL
videoPublicId String
isActive      Boolean   default true
```

### Order
```
orderNumber   String    unique, format: ANTI-YYYYMMDD-NNNNN
user          ObjectId → User   (null for guests)
guestEmail    String
items         [{
  product       ObjectId → Product
  productName   String
  variantSize   String
  variantColour String
  quantity      Number
  price         Number   in cents, snapshotted at order time
  image         String   URL
}]
shippingAddress { name, street, city, province, postalCode, country, phone }
subtotal      Number    in cents
shippingCost  Number    in cents (R120 flat, free over R800)
discount      Number    in cents
total         Number    in cents
paymentMethod Enum      "payfast" | "eft_manual"
paymentStatus Enum      "pending" | "paid" | "failed" | "refunded"
payfastToken  String    PayFast payment ID from IPN
orderStatus   Enum      "processing" | "confirmed" | "shipped" | "delivered" | "cancelled"
trackingNumber String
notes         String
```

### Cart
```
user          ObjectId → User   (null for guests)
sessionId     String            (guest identifier from localStorage)
items         [{
  product       ObjectId → Product
  variantIndex  Number   index into product.variants array
  quantity      Number   default 1
  price         Number   in cents, snapshotted at add-to-cart time
}]
couponCode    String
discount      Number    in cents
```

### Newsletter
```
email         String    required, unique, lowercase
isActive      Boolean   default true
source        String    e.g. "homepage-footer"
```

---

## 10. Key Business Processes

### Customer Purchase Flow

```
1. Browse shop or category page
2. Select product → choose size (OOS sizes are greyed out)
3. Click "Add to cart" → stock validated server-side
4. Review cart (shows size, colour, quantity, subtotal)
5. Proceed to checkout:
   a. Order summary shown (items, shipping, total)
   b. Fill in shipping address and email
   c. Choose payment: EFT or PayFast
6a. EFT path:
   - Order created, stock decremented
   - Cart cleared immediately
   - EFT banking details shown on-screen
   - Confirmation email sent
6b. PayFast path:
   - Order created (status: pending), stock decremented
   - Browser submits hidden form to payfast.co.za
   - Customer completes card / EFT payment on PayFast
   - PayFast POSTs IPN to BACKEND_URL/api/payment/notify
   - Backend marks order "paid" + "confirmed", clears cart, sends email
   - PayFast redirects browser to /checkout/success?custom_str1=ORDER_NUMBER
```

### Shipping Cost Calculation
```
Subtotal < R800   → R120 flat shipping
Subtotal >= R800  → Free shipping
```
Calculation happens server-side in `order.controller.js`.

### Stock Management Flow
```
Add to cart:     Soft check (reads current stock, rejects if insufficient)
Place order:     Atomic decrement: $inc { variants.N.stock: -quantity }
                 Condition: variants.N.stock >= quantity
                 If modifiedCount === 0 → order fails with "Insufficient stock"
Cancel order:    Stock restored by matching variantSize + variantColour
Admin dashboard: Manual stock edit per size in product modal
```

### Password Reset Flow
```
1. User visits /account/forgot-password and enters email
2. Backend generates 32-byte random token, SHA-256 hashes it
3. Hashed token + 1-hour expiry stored on User document
4. Raw token sent via email as URL: /account/reset-password?token=<raw>
5. User clicks link → enters new password
6. Frontend POSTs { token, password } to /api/auth/reset-password
7. Backend hashes token, finds user with matching hash and non-expired expiry
8. Password updated, token fields cleared
9. User redirected to /account to log in
```

### Guest vs Authenticated Cart
```
Guest:      Cart stored by sessionId (UUID in localStorage)
            x-session-id header sent on every API request
Login:      api.mergeCart(sessionId) called immediately after login
            Guest cart items merged into user cart
            Guest cart document deleted
Checkout:   Guest can checkout without account using email address
```

---

## 11. Authentication & Security

### JWT Tokens
- Signed with `JWT_SECRET` using HS256 algorithm
- Default expiry: 30 days
- Stored in `localStorage` under key `anti_token`
- Sent as `Authorization: Bearer <token>` on all authenticated requests
- Auto-removed from localStorage on any 401 response

### Password Rules
Minimum requirements enforced by backend regex:
- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

Passwords are hashed with bcrypt (salt rounds: 12) before storage and never returned in any API response.

### Rate Limiting
| Endpoint | Limit |
|---|---|
| POST /auth/login | 10 per 15 minutes |
| POST /auth/register | 5 per hour |
| POST /auth/forgot-password | 5 per hour |
| POST /orders | 10 per 15 minutes |

### Security Headers
Helmet is configured with defaults, providing:
`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`,
`Strict-Transport-Security`, `Referrer-Policy`

### CORS
Production: only `FRONTEND_URL` is whitelisted.
Development: localhost:3000 and localhost:3001.

---

## 12. Payments — PayFast Integration

PayFast is South Africa's leading payment gateway, supporting card, instant EFT, and wallet payments.

### How it works

PayFast uses a **server-side form POST** pattern, not an embedded SDK:

1. Frontend calls `POST /api/payment/initiate` with `orderId`
2. Backend builds a payment data object and signs it with MD5 + passphrase
3. Frontend receives the form data and submits a hidden `<form>` to `payfast.co.za`
4. Customer completes payment on PayFast's hosted page
5. PayFast sends an **IPN (Instant Payment Notification)** via server-to-server POST to `BACKEND_URL/api/payment/notify`
6. Backend verifies signature, checks merchant ID, checks amount, marks order paid
7. PayFast redirects browser to the `return_url` (our `/checkout/success` page)

### PayFast payment data fields
```
merchant_id     From PAYFAST_MERCHANT_ID
merchant_key    From PAYFAST_MERCHANT_KEY
return_url      /checkout/success?custom_str1=<orderNumber>
cancel_url      /checkout?payment=cancelled
notify_url      BACKEND_URL/api/payment/notify  ← must be backend, not frontend
m_payment_id    Order MongoDB _id
amount          Order total in Rand (e.g. "600.00")
item_name       "ANTI Order ANTI-20240501-00001"
custom_str1     orderNumber (passed back to success page)
email_address   Customer email
signature       MD5 hash of all fields + passphrase
```

### Sandbox vs Production
Set `PAYFAST_SANDBOX=true` to use `sandbox.payfast.co.za`. Set to `false` for live payments. The IPN IP whitelist is only enforced in production mode.

### IPN Security Checks
1. IP address must match PayFast's published IPs (production only)
2. Signature must match recalculated MD5
3. `merchant_id` must match `PAYFAST_MERCHANT_ID`
4. `amount_gross` must match order total
5. Idempotency: already-paid orders are skipped silently

---

## 13. Media — Cloudinary Integration

All product images, category images, and category videos are stored on Cloudinary. Local files are never stored on the server.

### Upload flow
```
Browser selects file
→ Multer intercepts multipart request
→ multer-storage-cloudinary streams file directly to Cloudinary
→ Cloudinary returns { path (URL), filename (publicId) }
→ URL and publicId saved to MongoDB
```

### Folder structure in Cloudinary
```
anti-store/
├── products/     Product images (max 1200px wide, auto quality)
├── categories/   Category images (max 1200px wide, auto quality)
├── videos/       Category videos (resource_type: video)
└── custom-orders/ Reference images for bespoke inquiries
```

### Image removal
When editing a product, the frontend sends `keepImageUrls` — a JSON array of all image URLs that should be kept. The backend diffs against the stored images and calls `cloudinary.uploader.destroy(publicId)` for any images not in the keep list.

### Video uploads
Category videos require `resource_type: "video"` on the Cloudinary storage config. The `categoryUploadMiddleware` routes `image` field to image storage and `video` field to video storage in a single request.

---

## 14. Email System

All transactional emails are sent via Nodemailer using SMTP.

### Email templates

| Template | Trigger | Recipient |
|---|---|---|
| Welcome | User registers | New user |
| Order Confirmation | EFT order placed / PayFast IPN received | Customer |
| Order Shipped | Admin marks order "shipped" | Customer |
| New Order Alert | Any order created | Admin (`EMAIL_USER`) |
| Password Reset | Forgot password request | User |
| Custom Order Confirmation | Custom order submitted | Customer |
| Custom Order Alert | Custom order submitted | Admin |

All templates use a shared branded HTML layout — dark header with "ANTI" wordmark, white body, action button, and footer with site link.

### Email failures
All `sendEmail(...)` calls are wrapped with `.catch(() => {})` — email failures never crash the request. Check SMTP credentials if emails are not delivering.

### Configuration
```
EMAIL_HOST     SMTP server (e.g. smtp.gmail.com)
EMAIL_PORT     587 (TLS) or 465 (SSL)
EMAIL_USER     Sender address (e.g. info@shopanti.online)
EMAIL_PASS     App password (Gmail: generate in Google Account settings)
```

For Gmail, enable 2FA and generate an **App Password** — do not use your regular Gmail password.

---

## 15. Admin Dashboard

The admin dashboard is a single-page client component at `/admin`. It is fully self-contained with no separate admin subdomain.

### Access
Only users with `isAdmin: true` on their User document can access the dashboard. Regular users see a "Not an admin account" error on login. To promote a user:

```bash
cd backend && npm run promote-admin
```

### Dashboard sections

**Dashboard tab**
- Revenue (sum of paid orders)
- Total order count
- Product count
- Pending order count
- Recent orders table

**Products tab**
- Search by name or slug
- Total stock per product (sum across all size variants)
- Low stock warning (< 3) and out-of-stock badge
- Edit modal with:
  - Name, description, price, category, collection, tags
  - Size variants table (XS / S / M / L / XL) with per-size stock, colour, SKU
  - Image management (upload new, remove existing, preview)
- Archive (soft-delete) product

**Categories tab**
- List all categories with thumbnail
- Edit modal with:
  - Name, description
  - Image upload / replace / remove
  - Video upload (file or URL) / replace / remove
- Archive category

**Orders tab**
- Search by order number or customer email
- Filter by order status
- Update modal:
  - Change order status (processing → confirmed → shipped → delivered / cancelled)
  - Set tracking number

---

## 16. Deployment

### Backend — Railway

The `railway.json` in the project root configures deployment:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm ci"
  },
  "deploy": {
    "startCommand": "cd backend && node server.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 30
  }
}
```

**Railway environment variables to set:**
```
MONGO_URI
JWT_SECRET
NODE_ENV=production
FRONTEND_URL=https://shopanti.online
BACKEND_URL=https://your-api.up.railway.app
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
PAYFAST_MERCHANT_ID
PAYFAST_MERCHANT_KEY
PAYFAST_PASSPHRASE
PAYFAST_SANDBOX=false
EMAIL_HOST
EMAIL_PORT
EMAIL_USER
EMAIL_PASS
```

### Frontend — Vercel / Netlify

Build command: `npm run build`
Output directory: `.next`

**Environment variables to set:**
```
NEXT_PUBLIC_API_BASE_URL=/api-proxy
BACKEND_URL=https://your-api.up.railway.app
```

### Go-live checklist
- [ ] `PAYFAST_SANDBOX=false` in Railway
- [ ] `BACKEND_URL` set to real Railway URL in both Railway and Vercel
- [ ] EFT banking details updated in `src/app/checkout/page.js` lines 9–13
- [ ] `FRONTEND_URL` matches the live frontend domain
- [ ] Test a real PayFast payment end-to-end (small amount)
- [ ] Confirm order confirmation email arrives after PayFast payment
- [ ] Confirm admin new order email arrives
- [ ] Test forgot password flow with a real email address
- [ ] Confirm Cloudinary uploads work (add a test product with image)

---

## 17. Third-Party Services

### MongoDB Atlas
- **What:** Hosted MongoDB database
- **Where:** [cloud.mongodb.com](https://cloud.mongodb.com)
- **Usage:** All application data — users, products, orders, carts
- **Connection:** `MONGO_URI` env var

### Cloudinary
- **What:** Cloud media storage and CDN
- **Where:** [cloudinary.com](https://cloudinary.com)
- **Usage:** Product images, category images, category videos, custom order reference images
- **Folders:** `anti-store/products`, `anti-store/categories`, `anti-store/videos`

### PayFast
- **What:** South African payment gateway
- **Where:** [payfast.co.za](https://payfast.co.za), sandbox at [sandbox.payfast.co.za](https://sandbox.payfast.co.za)
- **Usage:** Card payments and instant EFT
- **Integration:** Server-side form POST with MD5 signature + IPN webhook

### Nodemailer / SMTP
- **What:** Email delivery via any SMTP provider
- **Typical setup:** Gmail with App Password, or a transactional service like SendGrid / Mailgun
- **Usage:** All transactional emails (confirmations, resets, alerts)

---

## 18. Known Limitations & Future Work

### Current limitations

| Area | Limitation |
|---|---|
| Password policy | No special character requirement |
| Email verification | Accounts are not verified on registration |
| Cart race condition | Concurrent add-to-cart on same variant could allow fractional oversell (stock check is not atomic at cart stage) |
| Refunds | No programmatic refund endpoint — must be handled manually via PayFast dashboard |
| Multi-currency | Only ZAR supported |
| Shipping | Flat rate only — no courier API integration |

### Recommended future improvements

1. **Email verification on registration** — confirm email ownership before allowing login
2. **Transactional email provider** — replace SMTP with SendGrid or Postmark for better deliverability and tracking
3. **Webhook retry handling** — store raw IPN payload and log processing status
4. **Admin analytics** — sales charts, top products, conversion rate
5. **Discount / coupon codes** — the cart model has a `couponCode` field ready to be wired up
6. **Wishlist UI** — the User model stores a wishlist array; frontend UI not yet built
7. **Product reviews** — no review/rating system currently
8. **Inventory alerts** — email admin when a variant hits 0 stock

---

*Documentation last updated: May 2026*
*Built by KayGeeJr / ANTI Store development team*
