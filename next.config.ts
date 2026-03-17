import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/planmob_cgdi',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
