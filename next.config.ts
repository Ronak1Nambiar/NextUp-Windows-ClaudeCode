import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Keep native modules out of the webpack bundle so Node.js can load them
  serverExternalPackages: ['better-sqlite3', 'pdf-parse'],
  // Silence the "Critical dependency" warning from pdf-parse's dynamic require
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas', 'jsdom']
    }
    return config
  },
}

export default nextConfig
