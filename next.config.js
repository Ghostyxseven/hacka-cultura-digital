/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@google/generative-ai'],
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
  // PWA support
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
