/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const bcrypt = require('bcrypt');

const { UserServices } = require('../services');

/**
 * @type {RequestHandler}
 */
const validatePassword = async (req, res, next) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  if (!req.body.newPassword) {
    res.status(400).json({ error: 'New password must not be empty', field: 'newPassword' });
  } else {
    try {
      const user = await UserServices.getUserById(req.session.userId);

      if (user.body.found) {
        const compareWithOldPassword = await bcrypt.compare(oldPassword, user.body._source.hash_password || '');
        const compareWithNewPassword = await bcrypt.compare(newPassword, user.body._source.hash_password || '');

        if (compareWithOldPassword) {
          if (!compareWithNewPassword) {
            next();
          } else {
            res.status(400).json({ error: 'New password must be different from old password', field: 'newPassword' });
          }
        } else {
          res.status(400).json({ error: 'Old password does not match', field: 'oldPassword' });
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
  }
};

module.exports = validatePassword;
