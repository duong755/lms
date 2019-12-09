const { Router } = require('express');
const bcrypt = require('bcrypt');
const { isObject } = require('lodash');

const userService = require('../../services/User');

const courseRouter = require('./course');

const userRouter = Router({ mergeParams: true });

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

/**
 * get user data
 */
userRouter.get('/:userId', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (user.body.found) {
      res.status(200).json({ user: user.body._source });
    } else {
      res.status(500).json({ error: 'can not find user infomation' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
});

/**
 * edit user data
 */
userRouter.put('/:userId', async (req, res) => {
  try {
    if (req.body.newPassword !== undefined) {
      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;
      const hashPassword = await bcrypt.hash(req.body.newPassword, 10);
      const user = await userService.getUserById(req.params.userId);
      if (user.body.found) {
        const resultCompare = await bcrypt.compare(oldPassword, user.body._source.hashPassword);
        if (resultCompare) {
          if (newPassword !== user.body._source.hashPassword) {
            const resultUpdate = await userService.updateUserPassword(req.params.userId, hashPassword);
            if (resultUpdate.wasApplied()) {
              res.status(200).json({ success: 'Update password successfully' });
            } else {
              res.status(500).jsonon({ error: 'Can not update password' });
            }
          } else {
            res.status(400).json({ error: 'New password must be different old password' });
          }
        } else {
          res.status(400).json({ error: 'Old password does not match or new' });
        }
      } else {
        res.status(404).json({ error: 'Can not find this user' });
      }
    } else if (req.body.username !== undefined) {
      const updateResult = await userService.updateUserName(req.params.userId, req.body.username);
      if (updateResult.wasApplied()) {
        res.status(200).json({ success: 'Update username successfully' });
      } else {
        res.status(500).json({ error: 'Can not update username' });
      }
    } else if (req.body.email !== undefined) {
      const updateResult = await userService.updateEmail(req.params.userId, req.body.email);
      if (updateResult.wasApplied()) {
        res.status(200).json({ success: 'Update email successfully' });
      } else {
        res.status(500).json({ error: 'Can not update email' });
      }
    } else if (req.body.info !== undefined) {
      const updateResult = await userService.updateUserInfo(req.params.userId, req.body.info);
      if (updateResult.wasApplied()) {
        res.status(200).json({ success: 'Update information successfully' });
      } else {
        res.status(500).json({ error: 'Can not update information' });
      }
    } else {
      res.status(400).json({ error: 'Bad request' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
  // res.end('/api/user/:userId');
});

userRouter.use('/:userId/course', courseRouter);

module.exports = userRouter;
