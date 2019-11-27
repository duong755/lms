/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const jwt = require('jsonwebtoken');

const { extractFromCookie, extractFromAuthHeaderAsBearerToken } = require('../helpers/jwtExtractors');

/**
 * @type {RequestHandler}
 */
const auth = (req, res, next) => {
  const token = extractFromCookie(req) || extractFromAuthHeaderAsBearerToken(req);
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (!err) {
      res.clearCookie('access_token');
      res.clearCookie('lmsuser');
    } else {
      req.user = decoded;
      res.locals.user = decoded;
    }
    next();
  });
};

module.exports = auth;
