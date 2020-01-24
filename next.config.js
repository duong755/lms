require('dotenv').config();

module.exports = {
  powerByHeader: false,
  compress: process.env.NODE_ENV === 'production'
};
