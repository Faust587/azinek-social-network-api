const jwt = require('jsonwebtoken');

const createToken = (user, timeAction) => {
  const newToken = jwt.sign({
    user,
    createdAt: Date.now(),
  }, process.env.JWT_SECRET_KEY, {
    expiresIn: timeAction,
  });

  return newToken;
};

module.exports = {
  createToken,
};
