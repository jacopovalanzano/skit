const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: path.join('.next', 'skit')
};

module.exports = nextConfig
