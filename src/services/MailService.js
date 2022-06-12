const jwt = require('jsonwebtoken');
const sgMail = require('../mail/SendEmail');
const resetPasswordTemplate = require('../mail/templateEmail/ResetPasswordEmailTemplate');
const userModel = require('../models/User');

const SendResetPasswordEmail = async ({ userName, email }) => {
  const userData = {
    userName,
    email,
    token: jwt.sign({
      userName,
      email,
    }, process.env.JWT_SECRET_KEY, { expiresIn: '30m' }),
  };
  const message = await sgMail
    .sendEmail(resetPasswordTemplate.getResetPasswordEmailTemplate(userData));
  await userModel.findOneAndUpdate({ email }, { resetPasswordToken: userData.token });
  return message;
};

module.exports = {
  SendResetPasswordEmail,
};
