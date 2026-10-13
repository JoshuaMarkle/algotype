// next.config.js

const securityHeaders = [
  // No framing (clickjacking on /settings, /account)
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

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
