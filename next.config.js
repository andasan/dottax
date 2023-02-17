// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

// module.exports = withBundleAnalyzer({
//   reactStrictMode: false,
//   experimental: { appDir: true },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// });


/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["prisma", "@prisma/client"]
  },
  images: {
    domains: ["images.unsplash.com","img.freepik.com"]
  }
};

module.exports = nextConfig;
