module.exports = {
  // Allow LAN access to dev-only resources (HMR overlay) during `next dev`.
  allowedDevOrigins: ['192.168.1.100'],
  async rewrites() {
    return [
      {
        source: '/roboci',
        destination: 'https://esp32-gas-leak-sensor.vercel.app',
      },
      {
        source: '/roboci/:path*',
        destination: 'https://esp32-gas-leak-sensor.vercel.app/:path*',
      },
    ]
  },
}