/**
 * @typedef {import('express').Request} Request
 */

/**
 *
 * @param {Request} req
 * @returns {string | null}
 */
const extractFromCookie = (req) => {
  let token = null;
  if (req.cookies && req.cookies['access_token']) {
    token = req.cookies['access_token'];
  }
  return token;
};

/**
 *
 * @param {Request} req
 * @return {string | null}
 */
const extractFromAuthHeaderAsBearerToken = (req) => {
  if (req.headers.authorization) {
    return req.headers.authorization.replace(/^Bearer\s+/i, '');
  }
  return null;
};

module.exports = {
  extractFromCookie: extractFromCookie,
  extractFromAuthHeaderAsBearerToken: extractFromAuthHeaderAsBearerToken
};
