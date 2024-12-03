/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
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
