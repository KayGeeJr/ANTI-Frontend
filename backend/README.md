# ANTI Backend (Option A)

This backend runs separately from the existing Next.js frontend and exposes REST APIs under `/api/*`.

## Quick start

1. Copy env template:
   - `cp .env.example .env`
2. Fill credentials in `.env` (MongoDB, JWT, Cloudinary, PayFast, SMTP).
3. Install dependencies:
   - `npm install`
4. Run dev server:
   - `npm run dev`

## Scripts

- `npm run dev` - start with nodemon
- `npm start` - start with Node
- `npm run seed` - seed initial categories, collections, products

## API base

- `http://localhost:5000/api`

## Implemented route groups

- `/api/auth`
- `/api/products`
- `/api/categories`
- `/api/collections`
- `/api/cart`
- `/api/orders`
- `/api/payment`
- `/api/custom-orders`
- `/api/newsletter`
- `/api/admin`

## Notes

- Amounts are stored in cents.
- Product/category/collection image upload uses Cloudinary via Multer.
- Guest cart uses `sessionId` from body/query/header (`x-session-id`).
- Auth-protected routes require `Authorization: Bearer <JWT>`.

## Additional resources

- Env and deployment checklist: `ENV_SETUP.md`
- Seed script: `seed.js`
- Postman collection: `postman/ANTI_Backend.postman_collection.json`
