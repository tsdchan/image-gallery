module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/pwa/image-gallery/' // Adjust according to your production path
    : '/'
};
