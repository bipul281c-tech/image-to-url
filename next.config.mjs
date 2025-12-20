/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disabled reactCompiler due to Turbopack build issues on Vercel
  // reactCompiler: true,
  // cacheComponents: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-141831e61e69445289222976a15b6fb3.r2.dev",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ]
  },
}

export default nextConfig
