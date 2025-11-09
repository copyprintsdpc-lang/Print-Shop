/** @type {import('next').NextConfig} */
const s3Bucket = process.env.S3_BUCKET_NAME
const s3Region = process.env.S3_BUCKET_REGION || process.env.AWS_REGION || 'us-east-1'
const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN

const imageDomains = ['cdn.sdpcprint.com']

if (cloudFrontDomain) {
  imageDomains.push(cloudFrontDomain)
}

if (s3Bucket) {
  imageDomains.push(`${s3Bucket}.s3.amazonaws.com`)
  imageDomains.push(`${s3Bucket}.s3.${s3Region}.amazonaws.com`)
}

const nextConfig = {
  images: {
    domains: imageDomains,
  },
}

module.exports = nextConfig