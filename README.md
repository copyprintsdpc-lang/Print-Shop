# Sri Datta Print Center

High‑value B2B/B2C digital printing web app built with Next.js 15, TypeScript, Tailwind, and MongoDB.

## Auth (Email link verification)

This project includes a production-ready email signup/login flow using Next.js Route Handlers.

- Signup at `/signup` creates an unverified user and emails a verification link via Brevo SMTP
- Clicking the link hits `/api/auth/verify` and sets a JWT cookie, then redirects to `/dashboard`
- Login at `/login` is allowed only for verified users; resend link available and rate-limited
- `/dashboard` is protected by `middleware.ts`

Environment variables in `.env.local`:

```
MONGODB_URI=
JWT_SECRET=
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=
BREVO_SMTP_PASS=
EMAIL_FROM=copyprintsdpc@gmail.com
APP_URL=http://localhost:3000
```

Notes: The existing OTP route remains intact; prefer email link verification for account creation. OTP can be used for secondary flows (e.g., phone verification).

## Tech
- Next.js (App Router, API routes)
- TypeScript
- Tailwind CSS
- MongoDB + Mongoose

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` at the project root:
```bash
MONGODB_URI=your-encoded-mongodb-uri
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
```

3. Run the dev server:
```bash
npm run dev
```

Open the URL shown in your terminal (often `http://localhost:3000` or `3001`).

## Scripts
- `npm run dev`: Start development server
- `npm run build`: Production build
- `npm start`: Start production server

## Notes
- Do not commit `.env*` files; secrets are ignored by git.
- Currency is formatted in INR across the app.
