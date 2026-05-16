/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  output: 'export',
  basePath: isProd ? '/Poppy' : '',
  assetPrefix: isProd ? '/Poppy/' : '',
  images: { unoptimized: true },
};
export default nextConfig;
