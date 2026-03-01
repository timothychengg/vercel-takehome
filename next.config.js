/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      // Reduce file watchers to avoid EMFILE "too many open files" on macOS
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules', '**/.git'],
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
