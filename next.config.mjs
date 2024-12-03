/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@mui/styles': {
      transform: '@mui/styles/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    REACT_APP_API_URL: process.env.NEXT_PUBLIC_API_URL,
    REACT_APP_STATIC_SLUG: process.env.NEXT_PUBLIC_SLUG,
  },
};

export default nextConfig;

