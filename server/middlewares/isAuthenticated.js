const isAuthenticated = (req, res, next) => {
  if (res.locals.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthenticated' });
  }
};

module.exports = isAuthenticated;
