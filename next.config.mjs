/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true, // この行を追加
  env: {
    NEXT_PUBLIC_APIKEY: process.env.NEXT_PUBLIC_APIKEY,
    NEXT_PUBLIC_AUTHDOMAIN: process.env.NEXT_PUBLIC_AUTHDOMAIN,
    NEXT_PUBLIC_PROJECTID: process.env.NEXT_PUBLIC_PROJECTID,
    NEXT_PUBLIC_STORAGEBUCKET: process.env.NEXT_PUBLIC_STORAGEBUCKET,
    NEXT_PUBLIC_MESSAGINGSENDERID: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
    NEXT_PUBLIC_APPID: process.env.NEXT_PUBLIC_APPID
  },
  // exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
  //   return {
  //     '/': { page: '/' },
  //     '/cardRegistration': { page: '/cardRegistration' },
  //     // 他の静的ページを追加
  //   }
  // }
};


export default nextConfig;
