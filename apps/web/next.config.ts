import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 暂时禁用静态导出，使用标准构建
  // ...(process.env.NODE_ENV === "production" && { output: "export" }),
  images: {
    unoptimized: true,
  },
  // 压缩优化
  compress: true,
  // 生产环境优化
  poweredByHeader: false,
  // 优化重定向
  trailingSlash: false,
  // 优化构建
  reactStrictMode: false, // 暂时禁用严格模式以避免构建错误
  // 实验性功能（谨慎使用）
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // 禁用自动 lockfile 修补
  // Next.js 会在启动时自动修补 lockfile，但在 monorepo 中可能导致问题
  // 我们使用 bun 作为包管理器，不需要这个功能
};

export default nextConfig;
