/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

const { Router } = require('express');

const signoutRouter = Router({ mergeParams: true });

/**
 * @type {RequestHandler}
 */
const signout = (req, res) => {
  req.session = null;
  res.clearCookie('access_token');
  res.clearCookie('lms.user');
  res.status(200).end();
};

signoutRouter.all('/', signout);

module.exports = signoutRouter;
