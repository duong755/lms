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
      const user = userRes.body._source;
      delete user.hash_password;
      res.locals.user = user;
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
