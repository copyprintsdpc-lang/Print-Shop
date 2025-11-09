# AWS S3 + CloudFront Setup Guide for Sri Datta Print Center

## 🚀 Quick Setup Overview

This application now stores customer uploads and product assets in **Amazon S3** behind **CloudFront**. Follow the steps below to provision the required AWS resources and wire credentials into `.env.local`.

---

## 1. Create (or select) the S3 bucket

1. Open the AWS Console → **S3** → **Create bucket**  
2. Recommended configuration:
   - **Bucket name**: `sdpcbucket` (adjust if already taken)
   - **Region**: `us-east-1`
   - **Block public access**: keep *all* checkboxes enabled (objects should remain private)
   - **Versioning**: optional but recommended
   - **Default encryption**: enable `SSE-S3`
3. Optional: create folders such as `quotes/`, `products/`, `public/` for organization.

> ✅ Files are uploaded with private ACLs; downloads use presigned or CloudFront signed URLs.

---

## 2. Configure IAM access

1. Go to **IAM** → **Users** → **Add users**  
2. Create a user such as `sdpc-upload-service` with **Programmatic access**.
3. Attach an inline policy scoped to your bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::sdpcbucket",
        "arn:aws:s3:::sdpcbucket/*"
      ]
    }
  ]
}
```

4. Save the **Access key ID** and **Secret access key** – add them to `.env.local`.

---

## 3. (Optional but recommended) Create a CloudFront distribution

1. Open **CloudFront** → **Create distribution**  
2. Origin domain: select your S3 bucket.  
3. Set **Origin access control (OAC)** so CloudFront can read private objects.  
4. Viewer protocol policy: Redirect HTTP to HTTPS.  
5. Cache policy: Start with `Managed-CachingOptimized`.  
6. Once deployed, note the domain (e.g. `d123abcd.cloudfront.net`).  
7. To use signed URLs, create a **Key Pair** (Settings → Public keys). Download the generated PEM and store it securely.

> 💡 The app can fall back to temporary S3 presigned URLs if CloudFront signing isn’t configured yet.

---

## 4. Environment variables

Update `.env.local` with:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
S3_BUCKET_NAME=sdpcbucket
S3_BUCKET_REGION=us-east-1
CLOUDFRONT_DOMAIN=d123abcd.cloudfront.net
CLOUDFRONT_KEY_PAIR_ID=APKA...
# Either paste the key with escaped newlines...
CLOUDFRONT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
# ...or point to a file path
# CLOUDFRONT_PRIVATE_KEY_PATH=./certs/cloudfront-private-key.pem
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,docx
```

Commit `.env.local` to `.gitignore` so credentials never reach Git.

---

## 5. Test the integration

1. `npm install` (installs AWS SDK helpers).  
2. `npm run dev`  
3. Submit a quote request and verify uploads:
   - Files appear in S3 with private ACL.
   - Admin dashboard downloads work (signed URL).
   - Email / WhatsApp notifications include working download links.

---

## 6. (Optional) Rotate keys and monitor

- Rotate IAM keys regularly and update `.env.local`.
- Enable CloudFront and S3 access logs for auditing.
- Configure bucket lifecycle policies (e.g. auto-delete after 180 days).

You’re all set! S3 + CloudFront now powers secure file handling for the Print Shop. 🎉

