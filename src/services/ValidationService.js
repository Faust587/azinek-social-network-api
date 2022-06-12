const bcrypt = require('bcrypt');
const userModel = require('../models/User');
const { prepareLoginData, prepareUpdateData } = require('../utils/PreparationUtils');
const { STATUS: { FAIL, SUCCESS }, ERRORS } = require('../constants/Validation');
const { STATUS: { CONFIRMED } } = require('../constants/Status');

const checkUserExist = async (userName) => userModel.findOne({ userName });

const checkUserName = (userName) => {
  /**
   * Should start with an alphabet
   * All other characters can be alphabets, numbers or an underscore
   */
  const userNameRegex = /^[A-Za-z][A-Za-z0-9_]{5,15}$/;
  return userNameRegex.test(userName);
};

const checkFullName = (fullName) => {
  /**
   * Should start with an alphabet
   * All other characters can be alphabets, numbers or an underscore
   * 5 to 30 characters
   */
  const nameRegex = /^[^\s][A-Za-z][ A-Za-z_]{5,30}$/;
  return nameRegex.test(fullName);
};

const checkPassword = (password) => {
  /**
   * At least one number
   * At least one capital letter
   * Any character expect line breaks
   * 5 chars min
   * Example: Password1 - is valid
   * Example: password - is invalid
   */
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/;
  return passwordRegex.test(password);
};

const checkEmail = (email) => {
  const emailRegex = /^[^@\s]+@[^@\s.]+\.[^@.\s]+$/;
  return emailRegex.test(email);
};

const checkEmailExist = async (email) => userModel.findOne({ email });

const validateRegistrationData = async (inputData) => {
  const validationResult = {
    status: SUCCESS,
    errors: [],
  };

  const {
    email,
    userName,
    fullName,
    password,
  } = inputData;

  if (!email) {
    validationResult.errors.push('Email is required field!');
    validationResult.status = FAIL;
  }
  if (!userName) {
    validationResult.errors.push('Username is required field!');
    validationResult.status = FAIL;
  }
  if (!fullName) {
    validationResult.errors.push('Full name is required field!');
    validationResult.status = FAIL;
  }
  if (!password) {
    validationResult.errors.push('Password is required field!');
    validationResult.status = FAIL;
  }

  const userExist = await checkUserExist(userName);
  const isValidUserName = checkUserName(userName);
  const isValidFullName = checkFullName(fullName);
  const isValidEmail = checkEmail(email);
  const emailExist = await checkEmailExist(email);
  const isValidPassword = checkPassword(password);

  if (userExist) {
    validationResult.errors.push('Error, user already exist');
    validationResult.status = FAIL;
  }

  if (!isValidUserName) {
    validationResult.errors.push('Error, this username not valid');
    validationResult.status = FAIL;
  }
  if (!isValidFullName) {
    validationResult.errors.push('Error, this name not valid');
    validationResult.status = FAIL;
  }
  if (!isValidEmail) {
    validationResult.errors.push('Error, invalid email');
    validationResult.status = FAIL;
  }
  if (emailExist) {
    validationResult.errors.push('Error, this email already exist');
    validationResult.status = FAIL;
  }
  if (!isValidPassword) {
    validationResult.errors.push('Error, invalid password');
    validationResult.status = FAIL;
  }

  return validationResult;
};

const deleteSpacesFromModel = ({
  userName,
  fullName,
  email,
  password,
}) => ({
  userName: userName.replace(/\s/g, ''),
  fullName: fullName.trim(),
  email: email.replace(/\s/g, ''),
  password: password.replace(/\s/g, ''),
});

const validateLoginData = async ({ email, password }) => {
  const validationResult = {
    status: SUCCESS,
    errors: [],
  };
  if (!email || !password) {
    validationResult.status = FAIL;
    if (!email) {
      validationResult.errors.push(ERRORS.EMAIL_UNDEFINED);
    }
    if (!password) {
      validationResult.errors.push(ERRORS.PASSWORD_UNDEFINED);
    }
    return validationResult;
  }

  const preparedUserData = prepareLoginData({ email, password });
  const user = await userModel.findOne({ email: preparedUserData.email });

  if (!user) {
    validationResult.status = FAIL;
    validationResult.errors.push(ERRORS.USER_NOT_FOUND);
    return validationResult;
  }

  const isSamePassword = bcrypt.compareSync(preparedUserData.password, user.password);
  if (!isSamePassword) {
    validationResult.status = FAIL;
    validationResult.errors.push(ERRORS.WRONG_PASSWORD);
    return validationResult;
  }

  if (user.status !== CONFIRMED) {
    validationResult.status = FAIL;
    validationResult.errors.push(ERRORS.USER_NOT_CONFIRMED);
  }

  return validationResult;
};

const validateUpdateData = async ({
  userName, fullName, email, id,
}) => {
  const validationResult = {
    status: SUCCESS,
    errors: [],
    preparedData: undefined,
  };
  if (!userName || !fullName || !email || !id) {
    validationResult.status = FAIL;
    if (!userName) {
      validationResult.errors.push(ERRORS.USERNAME_UNDEFINED);
    }
    if (!fullName) {
      validationResult.errors.push(ERRORS.FULL_NAME_UNDEFINED);
    }
    if (!email) {
      validationResult.errors.push(ERRORS.EMAIL_UNDEFINED);
    }
    if (!id) {
      validationResult.errors.push(ERRORS.ID_UNDEFINED);
    }
    return validationResult;
  }
  const {
    preparedUserName, preparedFullName, preparedEmail, preparedID,
  } = prepareUpdateData({
    userName, fullName, email, id,
  });

  try {
    const user = await userModel.findById(preparedID);
    if (!user) {
      validationResult.status = FAIL;
      validationResult.errors.push(ERRORS.USER_NOT_FOUND);
      return validationResult;
    }
  } catch (err) {
    validationResult.status = FAIL;
    validationResult.errors.push(ERRORS.USER_NOT_FOUND);
    return validationResult;
  }

  const isValidUserName = checkUserName(preparedUserName);
  const isValidFullName = checkFullName(preparedFullName);
  const isValidEmail = checkEmail(preparedEmail);
  const emailExist = await checkEmailExist(preparedEmail);
  const userExist = await checkUserExist(preparedUserName);

  if (!isValidUserName) {
    validationResult.errors.push(ERRORS.INVALID_USERNAME);
    validationResult.status = FAIL;
  }
  if (!isValidFullName) {
    validationResult.errors.push(ERRORS.INVALID_FULL_NAME);
    validationResult.status = FAIL;
  }
  if (!isValidEmail) {
    validationResult.errors.push(ERRORS.INVALID_EMAIL);
    validationResult.status = FAIL;
  }
  if (emailExist) {
    validationResult.errors.push(ERRORS.EMAIL_ALREADY_TAKEN);
    validationResult.status = FAIL;
  }

  if (userExist) {
    validationResult.errors.push(ERRORS.USERNAME_ALREADY_TAKEN);
    validationResult.status = FAIL;
  }
  return validationResult;
};

module.exports = {
  validateRegistrationData,
  validateLoginData,
  deleteSpacesFromModel,
  validateUpdateData,
};
