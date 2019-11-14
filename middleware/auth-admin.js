const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const role = decodedToken.jobRole;
    const userId = decodedToken.userId;
    if (role === 'admin' && req.body.userId === userId) {
      next();
    } else {
      throw 'Permission Denied';
    }
  } catch {
    res.status(403).json({
      error: new Error('You are not authorized to view this content!')
    });
  }
};
