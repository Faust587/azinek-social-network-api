const MailService = require('../services/MailService');

const resetPasswordEmail = async (req, res) => {
  const userData = {
    userName: req.body.userName,
    email: req.body.email,
  };
  const sendEmail = await MailService.SendResetPasswordEmail(userData);
  if (!sendEmail) {
    return res.status(400).send('Failed to send Email');
  }
  return res.sendStatus(201);
};

module.exports = {
  resetPasswordEmail,
};
