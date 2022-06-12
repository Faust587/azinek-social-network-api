const jwt = require('jsonwebtoken');
const tokenModel = require('../models/Token');
const { ERRORS: { TOKEN_EXPIRED } } = require('../constants/Validation');

module.exports = function verifyToken(req, res, next) {
  try {
    const bearerHeader = req.headers.authorization;
    if (typeof (bearerHeader) === 'undefined') {
      return res.status(403).send('Authorization: Bearer header not found');
    }
    const token = bearerHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, result) => {
      if (err) {
        return res.status(403).send(err.message);
      }
      const databaseToken = await tokenModel.findOne({
        $or: [
          { accessToken: token },
          { refreshToken: token },
        ],
      });
      if (!databaseToken) {
        return res.status(401).send({ errors: [TOKEN_EXPIRED] });
      }
      req.authToken = token;
      req.accessToken = databaseToken.accessToken;
      req.refreshToken = databaseToken.refreshToken;
      req.user = result.user;
      return next();
    });
  } catch (err) {
    return res.status(401).send(err);
  }
  return null;
};
