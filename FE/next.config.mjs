/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zmxpjsmxtgzthtqs.tunnel-pt.elice.io",
      },
    ],
  },
};

export default nextConfig;
