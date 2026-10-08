/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_API_ORIGIN: process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:5000',
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94750519450',
    NEXT_PUBLIC_PAYHERE_MERCHANT_ID: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '1238347',
    NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET || 'MjY4NTA3MjUxNzE2NTAxOTA5NjAxNjY3Njc3NDg1MjA3OTAyNjQ0Mw==',
    NEXT_PUBLIC_PAYHERE_CHECKOUT_URL: process.env.NEXT_PUBLIC_PAYHERE_CHECKOUT_URL || 'https://sandbox.payhere.lk/pay/checkout',
  },
};

module.exports = nextConfig;
