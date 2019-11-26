/**
 * @typedef {import('express').RequestHandler} RequestHandler
 * @typedef {import('express').Request} Request
 */
const jwt = require('jsonwebtoken');

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

/**
 * @type {RequestHandler}
 */
const auth = (req, res, next) => {
  const token = extractFromCookie(req) || extractFromAuthHeaderAsBearerToken(req);
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (!err) {
      res.clearCookie('access_token');
    } else {
      req.user = decoded;
      res.locals.user = decoded;
    }
    next();
  });
};

module.exports = auth;
