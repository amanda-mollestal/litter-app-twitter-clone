import million from 'million/compiler';
// import { withBundleAnalyzer } from '@next/bundle-analyzer'


// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })
 
// /** @type {import('next').NextConfig} */
// const nextConfig = {}
 
// module.exports = withBundleAnalyzer(nextConfig)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};




const millionConfig = {
  auto: { rsc: true },
};

export default million.next(nextConfig, millionConfig);


