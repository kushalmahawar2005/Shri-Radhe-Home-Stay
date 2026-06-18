/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static export — builds to ./out as plain HTML/CSS/JS.
  // Deployable to any CDN / static host (Vercel, Netlify, GitHub Pages, S3...).
  output: "export",

  // Static export cannot use the Next.js Image Optimization server,
  // so images are served as-is. (We still get lazy-loading, sizing, blur.)
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" },
    ],
  },

  // Cleaner URLs on static hosts (/rooms/ instead of /rooms.html).
  trailingSlash: true,

  reactStrictMode: true,
};

module.exports = nextConfig;
