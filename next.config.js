const { i18n } = require("./next-i18next.config");

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = {
  i18n,
  reactStrictMode: true,
};
