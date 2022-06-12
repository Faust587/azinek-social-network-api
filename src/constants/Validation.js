const STATUS = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

const ERRORS = {
  EMAIL_UNDEFINED: 'Email field is required',
  PASSWORD_UNDEFINED: 'Password field is required',
  USERNAME_UNDEFINED: 'Username field is required',
  FULL_NAME_UNDEFINED: 'Full name field is required',
  ID_UNDEFINED: 'User id is required',
  USER_NOT_FOUND: 'User not found',
  USERS_NOT_FOUND: 'Users not found',
  WRONG_PASSWORD: 'Wrong password',
  INVALID_EMAIL: 'Invalid email',
  INVALID_USERNAME: 'Invalid username',
  INVALID_FULL_NAME: 'Invalid full name',
  EMAIL_ALREADY_TAKEN: 'Email already taken',
  VALIDATION_ERROR: 'Validation error',
  USERNAME_ALREADY_TAKEN: 'Username already taken',
  USER_NOT_AUTHORIZED: 'User not authorized',
  USER_NOT_CONFIRMED: 'User not confirmed',
  ACCESS_DENIED: 'Access denied',
  TOKEN_EXPIRED: 'Token expired',
  WRONG_TOKEN: 'Wrong token',
};

module.exports = { STATUS, ERRORS };
