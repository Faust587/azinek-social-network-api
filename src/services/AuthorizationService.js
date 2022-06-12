const userModel = require('../models/User');
const tokenModel = require('../models/Token');
const { STATUS: { SUCCESS, FAIL } } = require('../constants/Validation');
const { validateLoginData } = require('./ValidationService');
const { createToken } = require('./TokenService');
const { prepareLoginData } = require('../utils/PreparationUtils');

const loginUser = async (dataUser) => {
  const result = {
    status: SUCCESS,
    errors: [],
    token: '',
  };
  const validationResult = await validateLoginData(dataUser);
  if (validationResult.status === FAIL) {
    result.status = FAIL;
    result.errors.push(validationResult.errors);
    return result;
  }
  const { email } = prepareLoginData(dataUser);
  const user = await userModel.findOne({ email });

  const accessToken = createToken(user.toJSON(), '1h');
  const refreshToken = createToken(user.toJSON(), '30d');

  const token = await tokenModel.findOneAndUpdate({ user }, {
    accessToken,
    refreshToken,
  }, { new: true, upsert: true }).populate('user');

  result.token = token.toJSON();
  return result;
};

const logoutUser = async (userToken) => {
  const result = {
    status: SUCCESS,
    errors: [],
  };
  await tokenModel.findOneAndDelete({ userToken });
  return result;
};

module.exports = {
  loginUser,
  logoutUser,
};
