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

module.exports = nextConfig