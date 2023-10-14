/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/rtw-enemy-tracker",experimental: {
    images: {unoptimized: true},serverActions: false,
  },
  output: "export",
  images: { unoptimized: true },
};

module.exports = nextConfig;
