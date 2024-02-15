/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASE_PATH,
  webpack: (config, { isServer }) => {
    // Adicione o fallback para 'fs' apenas quando estiver renderizando no servidor
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    return config;
  },
};

export default nextConfig;
