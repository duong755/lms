/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const { UserServices } = require('../../server/services');

/**
 * @type {RequestHandler}
 */
const auth = async (req, res, next) => {
  try {
    const userRes = await UserServices.getUserById(req.session.userId, void 0, ['hash_password']);
    if (userRes.body.found) {
      res.locals.user = userRes.body._source;
    } else {
      res.locals.user = null;
    }
  } catch {
    res.locals.user = null;
  } finally {
    next();
  }
};

module.exports = auth;
