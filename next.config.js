require('dotenv').config();

module.exports = {
  powerByHeader: false,
  compress: process.env.NODE_ENV === 'production',
  webpack(config) {
    config.resolve.extensions = ['.ts', '.js', '.tsx', '.jsx'];
    config.devtool = 'source-map';

    return config;
  }
};
