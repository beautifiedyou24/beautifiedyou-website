/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // {
            //     protocol: 'https',
            //     hostname: 'res.cloudinary.com',
            //     port: '',
            //     pathname: '/dxkhkwtas/**',
            // },
            {
                protocol: 'https',
                hostname: '**', 
            }
        ],
    },
};

export default nextConfig;
