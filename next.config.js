/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server / serverless app (deployed on Vercel). Static export is OFF because
  // the site now has an admin panel, a database and image uploads.

  images: {
    // WebP only: AVIF is ~20% smaller but takes several seconds of CPU to
    // encode each size on first request, which made photos appear very
    // slowly. WebP encodes almost instantly and is supported everywhere.
    formats: ["image/webp"],
    // Cache optimized images at the edge for a year.
    minimumCacheTTL: 31536000,
    // Allow Next.js image optimization for remote/Blob-hosted photos.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Vercel Blob public URLs
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "**" },
    ],
  },

  // Cleaner URLs (/rooms/ instead of /rooms.html).
  trailingSlash: true,

  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  async redirects() {
    // Old/likely-typed URLs → the canonical page, so no link equity is lost
    // and visitors never hit a 404.
    return [
      // Rooms were renamed in Nov 2026 (Deluxe → Makhan Chor, Family → Bal
      // Gopal, Premium → Radha Rani).
      { source: "/rooms/deluxe", destination: "/rooms/makhan-chor/", permanent: true },
      { source: "/rooms/family", destination: "/rooms/bal-gopal/", permanent: true },
      { source: "/rooms/premium", destination: "/rooms/radha-rani/", permanent: true },
      { source: "/home-stay", destination: "/", permanent: true },
      { source: "/homestay", destination: "/", permanent: true },
      { source: "/room", destination: "/rooms/", permanent: true },
      { source: "/book", destination: "/booking/", permanent: true },
      { source: "/contact-us", destination: "/contact/", permanent: true },
      { source: "/about-us", destination: "/about/", permanent: true },
      {
        source: "/nearby",
        destination: "/attractions/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
