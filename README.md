# CopyPrint Shop

High‑value B2B/B2C digital printing web app built with Next.js 15, TypeScript, Tailwind, and MongoDB.

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
