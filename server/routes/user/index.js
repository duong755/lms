const { Router } = require('express');
const bcrypt = require('bcrypt');

const auth = require('../../middlewares/auth');
const userService = require('../../services/User');

const courseRouter = require('./course');

const userRouter = Router({ mergeParams: true });

/**
 * auth user info
 */
userRouter.all('/', (req, res) => {
  res.status(200).json(res.locals.user);
});

/**
 * get user data
 */
userRouter.get('/:userId', auth, async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (user.body.found) {
      res.status(200).json({ user: user.body._source });
    } else {
      res.status(500).json({ error: 'can not find user infomation' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

/**
 * edit user data
 */
userRouter.put('/:userId', auth, async (req, res) => {
  try {
    if (req.body.password !== undefined) {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const updateResult = await userService.updateUserPassword(req.params.userId, hashPassword);
      if (updateResult.wasApplied()) {
        res.status(200).json({ success: 'Update password successfully' });
      } else {
        res.status(500).json({ error: 'Can not update password' });
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
    res.status(500).json({ error: error });
  }
  res.end('/api/user/:userId');
});

userRouter.use('/:userId/course', courseRouter);

module.exports = userRouter;
