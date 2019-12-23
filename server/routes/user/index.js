/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

const { Router } = require('express');
const bcrypt = require('bcrypt');
const { isObject } = require('lodash');

const { isAuthenticated, validateEmail, validateUsername } = require('../../middlewares');
const userService = require('../../services/User');

const courseRouter = require('./course');

const userRouter = Router({ mergeParams: true });

/**
 * @type {RequestHandler}
 */
const updatePasswordMiddleware = async (req, res, next) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  try {
    const user = await userService.getUserById(req.session.userId);

    if (user.body.found) {
      const compareWithOldPassword = await bcrypt.compare(oldPassword, user.body._source.hash_password || '');
      const compareWithNewPassword = await bcrypt.compare(newPassword, user.body._source.hash_password || '');

      if (compareWithOldPassword) {
        if (!compareWithNewPassword) {
          next();
        } else {
          res.status(400).json({ error: 'New password must be different from old password' });
        }
      } else {
        res.status(400).json({ error: 'Old password does not match' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (findUserByIdErr) {
    console.error('Validate password', findUserByIdErr);
    res.status(500).json({
      error: 'An unexpected error occurred'
    });
  }
};

/**
 * auth user info
 */
userRouter.all('/', (req, res) => {
  if (isObject(res.locals.user)) {
    res.status(200).json(res.locals.user);
    return;
  }
  res.status(200).json(null);
});

userRouter.put('/email', isAuthenticated, validateEmail.isEmailValid, validateEmail.isEmailUnique, async (req, res) => {
  try {
    const updateEmailRes = await userService.updateEmail(req.session.userId, req.body.email);
    if (updateEmailRes.wasApplied()) {
      res.status(200).json({
        successful: true
      });
    } else {
      res.status(500).json({
        error: 'An unexpected error occurred'
      });
    }
  } catch (updateEmailErr) {
    res.status(500).json({
      error: 'An unexpected error occurred'
    });
  }
});

userRouter.put(
  '/username',
  isAuthenticated,
  validateUsername.isUsernameValid,
  validateUsername.isUsernameUnique,
  async (req, res) => {
    try {
      const updateUsernameRes = await userService.updateUserName(req.session.userId, req.body.username);
      if (updateUsernameRes.wasApplied()) {
        res.status(200).json({
          successful: true
        });
      } else {
        res.status(500).json({
          error: 'An unexpected error occured'
        });
      }
    } catch (updateUsernameErr) {
      console.error('Update username', updateUsernameErr);
      res.status(500).json({
        error: 'An unexpected error occured'
      });
    }
  }
);

userRouter.put('/password', isAuthenticated, updatePasswordMiddleware, async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.newPassword, 10);
    const updatePasswordRes = await userService.updateUserPassword(req.session.userId, hashPassword);
    if (updatePasswordRes.wasApplied()) {
      res.status(200).json({ successful: true });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  } catch (updatePasswordErr) {
    console.error('Update password', updatePasswordErr);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

userRouter.put('/info', isAuthenticated, async (req, res) => {
  try {
    const updateInfoRes = await userService.updateUserInfo(req.session.userId, req.body);
    if (updateInfoRes.wasApplied()) {
      res.status(200).json({
        successful: true
      });
    } else {
      console.error('Update info', 'Info was not applied');
      res.status(500).json({
        error: 'An unexpected error occurred'
      });
    }
  } catch (updateInfoErr) {
    res.status(500).json({
      error: 'An unexpected error occurred'
    });
  }
});

/**
 * get user data
 */
userRouter.get('/:userId', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (user.body.found) {
      res.status(200).json({ user: user.body._source });
    } else {
      res.status(400).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

userRouter.use('/:userId/course', courseRouter);

module.exports = userRouter;
