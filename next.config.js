/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true,
    domains: [
      'files.stripe.com'
    ]
  },
}

module.exports = nextConfig
