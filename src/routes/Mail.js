const express = require('express');

const router = express.Router();
const mailController = require('../controllers/MailController');
const { ROUTERS_MAIL: { RESET_PASSWORD } } = require('../constants/Routes');

/* localhost:4000/mail/resetPassword */
router.post(RESET_PASSWORD, mailController.resetPasswordEmail);

module.exports = router;
