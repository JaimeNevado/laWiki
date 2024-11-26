/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['raw.githubusercontent.com'], // Add your trusted domains here
    },
    async rewrites() {
      return [
        {
          source: "/api/:path*", // Endpoint en el frontend
          destination: "http://127.0.0.1:13000/api/:path*", // URL del backend
        },
      ];
    },
  };
  
  module.exports = nextConfig;

  