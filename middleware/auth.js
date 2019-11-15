const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;
    if (String(req.body.userId) === String(userId)) {
      next();
    } else {
      throw 'Invalid user';
    }
  } catch {
    res.status(401).json({
      status: "error",
      error: "Authorization failed. Invalid attempt."
    });
  }
};
