/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false,
   images: {
    remotePatterns: [
        {
            protocol: "https",
            hostname: "utfs.io"
        },
        {
            protocol: "https",
            hostname: "img.clerk.com"
        }
    ]
   }
};

export default nextConfig;
