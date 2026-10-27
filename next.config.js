/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server / serverless app (deployed on Vercel). Static export is OFF because
  // the site now has an admin panel, a database and image uploads.

  images: {
    // Serve AVIF/WebP where the browser supports it — the single biggest
    // Core Web Vitals win on a photo-heavy site.
    formats: ["image/avif", "image/webp"],
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
