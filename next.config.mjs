/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Don't attempt to load these server-only modules on the client side
            config.resolve.fallback = {
                ...config.resolve.fallback,
                ssh2: false,
                'node-ssh': false,
                crypto: false,
                stream: false,
                net: false,
                tls: false,
                fs: false,
                path: false,
            }
        }
        return config
    },
    experimental: {
        serverComponentsExternalPackages: ['ssh2', 'node-ssh'],
    },
}

export default nextConfig
