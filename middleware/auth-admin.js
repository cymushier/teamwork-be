const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const role = decodedToken.jobRole;
    if (role !== 'admin') {
      throw 'Permission Denied';
    } else {
      next();
    }
  } catch {
    res.status(403).json({
      status: "failed",
      data: {
        message: "Permission Denied. You are not allowed to perform this action."
      }
    });
  }
};
