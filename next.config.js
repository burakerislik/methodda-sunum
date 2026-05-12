/** @type {import('next').NextConfig} */
const repoName = "methodda-sunum";
// GitHub Pages repo adinizi kullanmak icin bu alani guncelleyebilirsiniz.

const isGitHubPagesBuild =
  process.env.GITHUB_ACTIONS === "true" || process.env.DEPLOY_TARGET === "github-pages";
const repoBase = isGitHubPagesBuild && repoName ? `/${repoName}` : "";

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
