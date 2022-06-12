const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/User');
const tokenModel = require('../models/Token');
const { prepareLoginData } = require('../utils/PreparationUtils');
const authorizationService = require('../services/AuthorizationService');
const validationService = require('../services/ValidationService');
const { STATUS: { FAIL } } = require('../constants/Validation');
const { STATUS: { CONFIRMED } } = require('../constants/Status');
const { ERRORS: { USER_NOT_FOUND, USERS_NOT_FOUND } } = require('../constants/Validation');
const sgMail = require('../mail/SendEmail');
const welcomeEmailTemplate = require('../mail/templateEmail/WelcomeEmailTemplate');

const registerUser = async (req, res) => {
  const userData = validationService.deleteSpacesFromModel(req.body);
  const validationResult = await validationService.validateRegistrationData(userData);
  if (validationResult.status === FAIL) {
    return res.status(400).json(validationResult);
  }
  userData.password = bcrypt.hashSync(userData.password, process.env.BCRYPT_SALT);

  userData.confirmationCode = jwt.sign({ userData }, process.env.JWT_SECRET_KEY);
  const welcomeEmail = welcomeEmailTemplate.generateWelcomeEmailTemplate(userData);
  await sgMail.sendEmail(welcomeEmail);

  await userModel.create(userData);
  return res.status(200).json(validationResult);
};

const loginUser = async (req, res) => {
  const loginUserResponse = await authorizationService.loginUser(req.body);
  return res.status(200).json(loginUserResponse);
};

const logoutUser = async (req, res) => {
  const response = await authorizationService.logoutUser(req.params.token);
  res.status(200).send(response);
};

const searchUser = async (req, res) => {
  const users = await userModel.find({ userName: { $regex: req.params.userName, $options: 'i' }, status: CONFIRMED });
  if (users === undefined || users.length === 0) {
    return res.status(404).send({ errors: [USERS_NOT_FOUND] });
  }
  return res.send(users.map((user) => user.toJSON()));
};

const updateUser = async (req, res) => {
  const { id, userName, fullName } = req.body;
  const user = await userModel.findOneAndUpdate(
    { id }, { userName, fullName }, { new: true },
  );
  if (!user) {
    return res.status(404).send({ errors: [USER_NOT_FOUND] });
  }
  return res.status(200).send(user.toJSON());
};

const getUser = async (req, res) => {
  const user = await userModel.findOne({ userName: req.params.userName });
  if (!user) {
    return res.status(404).send({ errors: [USER_NOT_FOUND] });
  }
  return res.send(user.toJSON());
};

module.exports = {
  registerUser,
  loginUser,
  searchUser,
  updateUser,
  getUser,
  logoutUser,
};
