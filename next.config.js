/** @type {import('next').NextConfig} */
const repoName = "methodda-sunum";
// GitHub Pages repo adinizi kullanmak icin bu alani guncelleyebilirsiniz.

const isProduction = process.env.NODE_ENV === "production";
const repoBase = isProduction && repoName ? `/${repoName}` : "";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  basePath: repoBase,
  assetPrefix: repoBase || undefined
};

module.exports = nextConfig;
