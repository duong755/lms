/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

const { Router } = require('express');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');

const { UserServices } = require('../../services');

const signinRouter = Router({ mergeParams: true });

/**
 * @type {RequestHandler}
 */
const findUserByUsernameOrEmail = async (req, res, next) => {
  if (!req.session.userId) {
    const emailOrUsername = req.body.emailOrUsername || req.body.email || req.body.username || '';
    try {
      const apiRes = await UserServices.getUserByEmailOrUsername(emailOrUsername);
      if (apiRes.body.hits.total) {
        res.locals.user = apiRes.body.hits.hits[0]._source;
        next();
      } else {
        throw new Error('Wrong username or password');
      }
    } catch (err) {
      res.status(400).json({
        error: err.message
      });
    }
  } else {
    res.status(200).json({
      successful: true,
      warning: 'You have already been authenticated'
    });
  }
};

/**
 * @type {RequestHandler}
 */
const comparePassword = (req, res, next) => {
  const { password } = req.body;
  const { hash_password } = res.locals.user;
  bcrypt.compare(password, hash_password, (err, same) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: err.message
      });
    } else {
      if (same) {
        next();
      } else {
        res.status(400).json({
          error: 'Wrong email/username or password'
        });
      }
    }
  });
};

/**
 * @type {RequestHandler}
 */
const signin = (req, res) => {
  const user = res.locals.user;
  delete user.hash_password;

  req.session.userId = user.id;
  res.cookie('lms.user', user, {
    sameSite: true,
    path: '/',
    expires: dayjs()
      .add(7, 'date')
      .toDate()
  });
  res.status(200).json({
    successful: true
  });
};

signinRouter.post('/*', findUserByUsernameOrEmail, comparePassword, signin);

module.exports = signinRouter;
