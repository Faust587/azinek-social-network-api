const jwt = require('jsonwebtoken');
const tokenModel = require('../models/Token');
const { ERRORS: { WRONG_TOKEN } } = require('../constants/Validation');

const refreshUserToken = async (req, res) => {
  if (req.authToken !== req.refreshToken) {
    return res.status(401).send({ errors: [WRONG_TOKEN] });
  }

  const newAccessToken = jwt.sign({
    user: req.user,
    createdAt: Date.now(),
  }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h',
  });

  const newRefreshToken = jwt.sign({
    user: req.user,
    createdAt: Date.now(),
  }, process.env.JWT_SECRET_KEY, {
    expiresIn: '30d',
  });

  // eslint-disable-next-line no-underscore-dangle
  const updatedToken = await tokenModel.findOneAndUpdate({ user: req.user._id }, {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  }, { new: true }).populate('user');

  return res.send({ ...updatedToken.toJSON() });
};

module.exports = {
  refreshUserToken,
};
