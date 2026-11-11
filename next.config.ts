import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  allowedDevOrigins: ['192.168.1.40'],
  // Forza il server di sviluppo a esporre correttamente i WebSocket sulla LAN
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Configura l'HMR client per usare l'IP corretto anziché localhost
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  }
};

export default nextConfig;
