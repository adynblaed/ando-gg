/**
 * Next.js Configuration
 * 
 * Configuration file for Next.js application settings.
 * Currently uses default settings. Add custom configuration as needed.
 * 
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Ensure webpack resolves modules from the project directory first
    const projectRoot = path.resolve(__dirname);
    config.resolve.modules = [
      path.resolve(projectRoot, "node_modules"),
      ...(config.resolve.modules || []),
    ];
    
    // Ensure webpack resolves from the project root, not parent directories
    config.resolve.roots = [
      projectRoot,
      ...(config.resolve.roots || []),
    ];
    
    return config;
  },
  // Explicitly use webpack (not Turbopack) due to custom module resolution config
  turbopack: {},
};

export default nextConfig;
