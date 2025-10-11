# Domain Setup Guide for Sri Datta Print Centre

## 🚀 Domain Configuration Plan

### Main Website: `sridattaprintcentre.com`
**Static Pages:**
- Home (`/`)
- Services (`/services`) 
- Contact (`/contact`)
- About Us (`/about`) - Optional

### Web Application: `app.sridattaprintcentre.com`
**Dynamic Pages:**
- Customer Portal (`/dashboard`)
- Order Management (`/order`, `/checkout`)
- Quote System (`/quote`)
- User Authentication (`/login`, `/signup`)
- File Upload (`/upload`)
- Order Tracking (`/order-track`)
- Admin Dashboard (`/admin/*`)

## 🔧 GoDaddy DNS Configuration

### Step 1: Configure Main Domain
1. **Login to GoDaddy**: Go to your GoDaddy account
2. **DNS Management**: Find your domain `sridattaprintcentre.com`
3. **Add A Record**:
   ```
   Type: A
   Name: @
   Value: [Your hosting IP address]
   TTL: 3600
   ```

### Step 2: Configure App Subdomain
1. **Add CNAME Record**:
   ```
   Type: CNAME
   Name: app
   Value: [Your app hosting domain]
   TTL: 3600
   ```

### Step 3: SSL Certificates
- **Main domain**: Configure SSL for `sridattaprintcentre.com`
- **Subdomain**: Configure SSL for `app.sridattaprintcentre.com`

## 📁 File Structure Plan

```
src/
├── app/                          # Main website (sridattaprintcentre.com)
│   ├── page.tsx                  # Home page
│   ├── services/
│   │   └── page.tsx             # Services overview
│   ├── contact/
│   │   └── page.tsx             # Contact information
│   ├── about/
│   │   └── page.tsx             # About us (optional)
│   └── layout.tsx               # Main website layout
├── app-portal/                   # Web app (app.sridattaprintcentre.com)
│   ├── dashboard/
│   ├── order/
│   ├── quote/
│   ├── login/
│   ├── signup/
│   ├── admin/
│   └── layout.tsx               # App layout
└── components/
    ├── WebsiteNavigation.tsx    # Navigation for main site
    └── AppNavigation.tsx        # Navigation for web app
```

## 🚀 Deployment Strategy

### Option 1: Vercel (Recommended)
- **Main website**: Deploy to `sridattaprintcentre.com`
- **Web app**: Deploy to `app.sridattaprintcentre.com`
- Automatic SSL certificates
- Easy domain management

### Option 2: Netlify
- Similar setup with custom domains
- Good for static + dynamic content

### Option 3: AWS/CloudFront
- More control over infrastructure
- Better for scaling

## 🔄 Environment Variables

### Main Website (.env.production)
```env
NEXT_PUBLIC_APP_URL=https://sridattaprintcentre.com
NEXT_PUBLIC_API_URL=https://app.sridattaprintcentre.com/api
```

### Web App (.env.production)
```env
NEXT_PUBLIC_APP_URL=https://app.sridattaprintcentre.com
NEXT_PUBLIC_MAIN_URL=https://sridattaprintcentre.com
```

## 📋 Next Steps

1. ✅ **Plan separation** - COMPLETED
2. 🔄 **Create static pages** - IN PROGRESS
3. ⏳ **Move dynamic routes to /app**
4. ⏳ **Update navigation components**
5. ⏳ **Configure DNS settings**
6. ⏳ **Set up deployment**
7. ⏳ **Configure SSL certificates**
8. ⏳ **Update environment variables**
