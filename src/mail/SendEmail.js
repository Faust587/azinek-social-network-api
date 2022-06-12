const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (body) => {
  if (process.env.LOCAL_DEVELOPMENT === 'true') {
    console.debug(body);
    return true;
  }
  try {
    await sgMail.send(body);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  sendEmail,
};
