/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const jwt = require('jsonwebtoken');

const { extractFromCookie, extractFromAuthHeaderAsBearerToken } = require('../helpers/jwtExtractors');
const { UserServices } = require('../../server/services');

/**
 * @type {RequestHandler}
 */
const auth = (req, res, next) => {
  const token = extractFromCookie(req) || extractFromAuthHeaderAsBearerToken(req);
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (!err || !decoded) {
      res.clearCookie('access_token');
      res.clearCookie('lms.user');
      delete req.user;
      delete res.locals.user;
      next();
    } else {
      const userId = decoded.id;
      try {
        const userRes = await UserServices.getUserById(userId, void 0, ['hash_password']);
        if (userRes.body.found) {
          req.user = userRes._source;
          res.locals.user = userRes._source;
        } else {
          res.clearCookie('access_token');
          res.clearCookie('lms.user');
          delete req.user;
          delete res.locals.user;
        }
      } catch (userErr) {
        next();
      } finally {
        next();
      }
    }
  });
};

module.exports = auth;
