/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/dota2/:path*',
        destination: 'http://localhost:3002/dota2/:path*', // Proxy to Backend
      },
    ]
  },
};

export default nextConfig;
