/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Thêm các config khác nếu cần
}

module.exports = nextConfig