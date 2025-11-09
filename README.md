# Sri Datta Print Center

Professional printing services website with online quote and order management.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Environment Setup
Create `.env.local` with:
```env
# Points to dev database; prod uses sdpc_print_prod
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sdpc_print_shop?retryWrites=true&w=majority
EMAIL_FROM=your_email@domain.com
SMTP_HOST=smtp.domain.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASS=your_password
CONTACT_EMAIL=your_contact_email
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=sdpcbucket
S3_BUCKET_REGION=us-east-1
CLOUDFRONT_DOMAIN=your_cloudfront_domain
CLOUDFRONT_KEY_PAIR_ID=your_key_pair_id
# Paste PEM with literal \n newlines or point to file path below
CLOUDFRONT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
# Optional: use path instead of inline key
# CLOUDFRONT_PRIVATE_KEY_PATH=./certs/cloudfront-private-key.pem
```
For production, copy the same URI but swap the database name to `sdpc_print_prod`.

### Run Development Server
```bash
npm run dev
```

### Seed Admin Accounts
```bash
# Owner + staff (idempotent: skips existing records)
node scripts/create-admin.js

# Danger: wipes admin-related collections, seeds owner only
node scripts/reset-admin.js
```
Default credentials (rotate before production):

| Role  | Email           | Password     |
|-------|-----------------|--------------|
| Owner | owner@sdpc.com  | Owner#543!@  |
| Staff | staff@sdpc.com  | Staff#543!@  |

### Cleanup Production Database
```bash
# Dry run (shows collections that would be removed)
ENV_FILE=.env.production node scripts/cleanup-prod-db.js

# Apply cleanup (drops everything except admins, quotes, pickups, services)
ENV_FILE=.env.production node scripts/cleanup-prod-db.js --apply
```

---

## 📋 Website MVP

### Public Pages (No Auth)
- `/` - Homepage with services
- `/services` - All printing services with category tabs
- `/quote` - Request a quote
- `/order` - Place an order
- `/contact` - Contact form

### MVP Flow
1. Customer uploads files
2. Selects paper size & delivery method
3. Enters phone number
4. Submits quote request
5. Print center receives email
6. Manual quote sent to customer

---

## 🎨 Features

- Real images integration
- Paper size guide
- File uploads
- Email notifications
- Admin dashboard
- Mobile responsive
- Professional UI

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (static)/           # Public website pages
│   └── (admin)/admin/      # Admin console & protected APIs
├── components/             # React components
├── lib/                    # Utilities
└── models/                 # Database models

public/
├── images/                 # Static images
└── uploads/                # User uploads

scripts/
├── create-admin.js         # Seed owner + staff accounts
├── reset-admin.js          # Reset & seed owner account
└── cleanup-prod-db.js      # Drop non-MVP collections (dry-run by default)
```

---

## 🔗 Important Links

- **SERVICE_IMAGES_PROMPTS.md** - Image generation prompts
- **ADMIN_LOGIN_INFO.txt** - Admin credentials
- **STORAGE_SETUP_GUIDE.md** - AWS S3 + CloudFront configuration

---

**Status:** ✅ Production Ready
