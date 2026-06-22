/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server / serverless app (deployed on Vercel). Static export is OFF because
  // the site now has an admin panel, a database and image uploads.

  images: {
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

  reactStrictMode: true,
};

module.exports = nextConfig;
