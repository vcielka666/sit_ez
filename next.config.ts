/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile images
      },
      {
        protocol: "https",
        hostname: "photos.google.com",        // Google Photos
      },
      {
        protocol: "https",
        hostname: "ssl.gstatic.com",          // Google static content (logos, icons)
      },
    ],
  },
};

module.exports = nextConfig;
