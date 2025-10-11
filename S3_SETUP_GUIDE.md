# AWS S3 Setup Guide for SDPC Web Application

## Overview

This guide will help you set up AWS S3 for file storage in your SDPC web application, including CloudFront CDN for optimal performance.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js application ready for S3 integration

## Step 1: S3 Bucket Configuration

### 1.1 Create S3 Bucket

```bash
# Create S3 bucket (using your bucket name)
aws s3 mb s3://sdpcbucket

# Enable versioning
aws s3api put-bucket-versioning --bucket sdpcbucket --versioning-configuration Status=Enabled

# Enable server-side encryption
aws s3api put-bucket-encryption --bucket sdpcbucket --server-side-encryption-configuration '{
  "Rules": [
    {
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }
  ]
}'
```

### 1.2 Configure Bucket Policy

Create a bucket policy to allow your application to access the bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sdpcbucket/*"
    },
    {
      "Sid": "AllowApplicationAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:user/sdpc-s3-user"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::sdpcbucket/*"
    }
  ]
}
```

### 1.3 Configure CORS

Set up CORS to allow your web application to upload files:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com",
      "https://www.yourdomain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## Step 2: IAM User and Policy

### 2.1 Create IAM User

```bash
# Create IAM user
aws iam create-user --user-name sdpc-s3-user

# Create access key
aws iam create-access-key --user-name sdpc-s3-user
```

### 2.2 Create IAM Policy

Create a policy file `s3-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl",
        "s3:GetObjectAcl"
      ],
      "Resource": "arn:aws:s3:::sdpcbucket/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::sdpcbucket"
    }
  ]
}
```

Attach the policy:

```bash
# Create policy
aws iam create-policy --policy-name SDPCS3Policy --policy-document file://s3-policy.json

# Attach policy to user
aws iam attach-user-policy --user-name sdpc-s3-user --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/SDPCS3Policy
```

## Step 3: CloudFront Distribution

### 3.1 Create CloudFront Distribution

1. Go to CloudFront console
2. Create new distribution
3. Set origin domain to your S3 bucket: `sdpcbucket.s3.amazonaws.com`
4. Configure settings:

```yaml
Origin Domain: sdpcbucket.s3.amazonaws.com
Origin Path: (leave empty)
Origin Access: Public
Viewer Protocol Policy: Redirect HTTP to HTTPS
Allowed HTTP Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
Caching Policy: CachingDisabled (for uploads) or Managed-CachingOptimized (for downloads)
```

### 3.2 Configure CloudFront Behaviors

Create separate behaviors for different file types:

1. **Uploads Behavior** (for temporary uploads):
   - Path Pattern: `/uploads/*`
   - Cache Policy: CachingDisabled
   - Origin Request Policy: CORS-S3Origin

2. **Public Files Behavior** (for public access):
   - Path Pattern: `/public/*`
   - Cache Policy: Managed-CachingOptimized
   - Origin Request Policy: CORS-S3Origin

## Step 4: Environment Configuration

Update your `.env.local` file:

```env
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
S3_BUCKET_NAME=sdpc-print-center-files
S3_BUCKET_REGION=us-east-1

# CloudFront Configuration
CLOUDFRONT_DOMAIN=your_cloudfront_domain.cloudfront.net
CLOUDFRONT_DISTRIBUTION_ID=your_distribution_id

# File Upload Configuration
MAX_FILE_SIZE=200MB
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,ai,psd,docx
UPLOAD_FOLDER=uploads
PUBLIC_FOLDER=public
```

## Step 5: Application Implementation

The application code will be updated to use S3 for file storage with the following features:

- Presigned URL generation for secure uploads
- File type and size validation
- Image optimization and thumbnail generation
- CloudFront integration for CDN delivery
- Error handling and retry logic

## Step 6: Testing

Test the S3 integration:

1. Upload a test file through the application
2. Verify file appears in S3 bucket
3. Check CloudFront distribution serves files correctly
4. Test file access permissions
5. Verify CORS configuration works

## Security Considerations

1. **Access Control**: Use IAM policies to restrict access
2. **Encryption**: Enable server-side encryption
3. **CORS**: Configure CORS properly for your domains
4. **Presigned URLs**: Use presigned URLs for secure uploads
5. **File Validation**: Validate file types and sizes
6. **Virus Scanning**: Consider adding virus scanning for uploads

## Cost Optimization

1. **Storage Classes**: Use appropriate storage classes (Standard, IA, Glacier)
2. **Lifecycle Policies**: Set up lifecycle policies for old files
3. **CloudFront**: Use CloudFront for frequently accessed files
4. **Monitoring**: Monitor usage and costs

## Monitoring and Logging

1. **CloudTrail**: Enable CloudTrail for API logging
2. **CloudWatch**: Set up CloudWatch alarms
3. **S3 Access Logs**: Enable S3 access logging
4. **Application Logs**: Log file upload events

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check CORS configuration
2. **Access Denied**: Verify IAM permissions
3. **Upload Failures**: Check presigned URL generation
4. **CloudFront Issues**: Verify distribution configuration

### Debug Commands

```bash
# Test S3 access
aws s3 ls s3://sdpc-print-center-files

# Test file upload
aws s3 cp test-file.pdf s3://sdpc-print-center-files/test/

# Check CloudFront distribution
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

## Next Steps

1. Complete the S3 bucket setup
2. Configure IAM user and policies
3. Set up CloudFront distribution
4. Update environment variables
5. Test the integration
6. Deploy to production

This setup will provide a robust, scalable file storage solution for your SDPC web application.
