import type { NextConfig } from "next";
// import { default as bundleAnalyzer } from '@next/bundle-analyzer'

const nextConfig: NextConfig = {
  /* config options here */
  experimental : {
    useCache: true,
  },
};

export default nextConfig;

// const withBundleAnalyzer = bundleAnalyzer({
//   enabled: process.env.ANALYZE === 'true',
// });
// export default withBundleAnalyzer(nextConfig);
