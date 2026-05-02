# Backend Environment Setup

Use this checklist to configure the backend before running full flows.

## 1) Create `.env`

From `backend/`:

```bash
cp .env.example .env
```

Fill every key:

- `NODE_ENV=development`
- `PORT=5000`
- `MONGO_URI=...`
- `JWT_SECRET=...`
- `JWT_EXPIRES_IN=30d`
- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`
- `PAYFAST_MERCHANT_ID=...`
- `PAYFAST_MERCHANT_KEY=...`
- `PAYFAST_PASSPHRASE=...`
- `PAYFAST_SANDBOX=true`
- `EMAIL_HOST=smtp.gmail.com`
- `EMAIL_PORT=587`
- `EMAIL_USER=info@shopanti.online`
- `EMAIL_PASS=...`
- `FRONTEND_URL=http://localhost:3000`

## 2) MongoDB quick check

- Ensure cluster allows your IP.
- Ensure DB user has read/write role.
- Test by starting backend:

```bash
npm run dev
```

You should see:

- `MongoDB connected`
- `Backend listening on port 5000`

## 3) Next.js frontend env

In the project root, add `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## 4) Seed data

From `backend/`:

```bash
npm run seed
```

## 5) PayFast local testing

ITN requires a public URL. Use ngrok:

```bash
ngrok http 5000
```

Then set PayFast notify URL to:

- `https://<ngrok-id>.ngrok.io/api/payment/notify`

## 6) Production checklist

- Set `NODE_ENV=production`
- Set `PAYFAST_SANDBOX=false`
- Set production `FRONTEND_URL`
- Restrict CORS origin to your domain
- Verify SMTP sender domain setup
