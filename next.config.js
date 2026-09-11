module.exports = {
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