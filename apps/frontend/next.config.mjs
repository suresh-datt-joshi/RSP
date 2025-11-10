/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  webpack: (config, { isServer }) => {
    // Fix for chunk loading issues with dynamic imports
    if (!isServer) {
      config.output.publicPath = '/_next/';
    }
    return config;
  }
};

export default nextConfig;

