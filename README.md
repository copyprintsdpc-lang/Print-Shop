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
MONGODB_URI=your_mongodb_connection_string
EMAIL_FROM=your_email@domain.com
SMTP_HOST=smtp.domain.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASS=your_password
CONTACT_EMAIL=your_contact_email
```

### Run Development Server
```bash
npm run dev
```

### Create Admin Account
```bash
node scripts/create-admin.js
```
**Login:** admin@sdpc.com / Admin@123

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
│   └── (app)/              # Web app (parked)
├── components/             # React components
├── lib/                    # Utilities
└── models/                 # Database models

public/
├── images/                 # Static images
└── uploads/                # User uploads

scripts/
└── create-admin.js         # Create admin account
```

---

## 🔗 Important Links

- **SERVICE_IMAGES_PROMPTS.md** - Image generation prompts
- **ADMIN_LOGIN_INFO.txt** - Admin credentials

---

**Status:** ✅ Production Ready
