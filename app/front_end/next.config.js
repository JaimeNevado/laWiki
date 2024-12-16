/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      // add your link following this pattern
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
        search: '',
      }
    ]
  }
  // images: {
  //   domains: [], // Add your trusted domains here
  // },
};

module.exports = nextConfig;