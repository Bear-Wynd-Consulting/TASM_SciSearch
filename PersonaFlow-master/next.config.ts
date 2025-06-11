
import type {NextConfig} from 'next';
import config from 'next/config';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
   webpack: (config, { isServer }) => {
     if (!isServer) {
  //     // Ensure resolve and fallback objects exist before modification
       config.resolve.fallback = { async_hooks: false, ...config.resolve.fallback }; // Prevent 'async_hooks' from being bundled on the client
       };
     },
     return: (config),
   };

export default nextConfig;
