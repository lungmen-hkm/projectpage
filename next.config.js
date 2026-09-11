module.exports = {
  async rewrites() {
    return [
      {
        source: '/roboci',
        destination: 'https://roboci-app.vercel.app/roboci',
      },
      {
        source: '/roboci/:path*',
        destination: 'https://roboci-app.vercel.app/roboci/:path*',
      },
    ]
  },
}