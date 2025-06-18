// next.config.js

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/analytics/script.js",
        destination: "https://cloud.umami.is/script.js",
      },
      {
        source: "/analytics/api/send",
        destination: "https://cloud.umami.is/api/send",
      },
    ];
  },
};

export default nextConfig;
