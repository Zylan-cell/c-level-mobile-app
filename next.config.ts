import type { NextConfig } from "next";

// Определяем имя репозитория для GitHub Pages
const repo = 'c-level-mobile-app';
const isProduction = process.env.NODE_ENV === 'production';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isProduction ? `/${repo}` : '');

const nextConfig: NextConfig = {
  // Настройка базового пути для GitHub Pages
  basePath,
  // Настройка префикса для ассетов
  assetPrefix: basePath,
  // Отключаем строгую проверку ESM для совместимости с GitHub Pages
  transpilePackages: ['react-syntax-highlighter', 'swagger-ui-react', 'swagger-client'],
  // Отключаем проверку ESLint при сборке
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Отключаем проверку типов TypeScript при сборке
  typescript: {
    ignoreBuildErrors: true,
  },
  // Включаем поддержку PWA
  output: 'export',
  // Настройки для статической генерации
  experimental: {
    // Современные версии Next.js уже используют App Router по умолчанию
  },
  // Настройка для изображений
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
