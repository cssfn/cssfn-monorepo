/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    experimental: {
        esmExternals: 'loose',
    },
    
    webpack: (config) => {
        config.experiments = {
            ...config.experiments,
            ...{
                topLevelAwait: true
            }
        }
        return config
    },
}

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: true,
// });
// module.exports = withBundleAnalyzer(nextConfig);

module.exports = nextConfig