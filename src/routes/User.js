const express = require('express');

const router = express.Router();
const userController = require('../controllers/UserController');
const verifyToken = require('../middlewares/verifyToken');
const {
  ROUTERS_USER: {
    REGISTRATION, LOGIN, REFRESH_USER_TOKEN, SEARCH_USER, UPDATE_USER, GET_USER,
    LOGOUT_USER,
  },
} = require('../constants/Routes');
const tokenController = require('../controllers/TokenController');

/* /user/register */
router.post(REGISTRATION, userController.registerUser);

/* /user/login */
router.post(LOGIN, userController.loginUser);

/* /user/refresh */
router.post(REFRESH_USER_TOKEN, verifyToken, tokenController.refreshUserToken);

/* /user/update */
router.post(UPDATE_USER, verifyToken, userController.updateUser);

/* /user/logout/:token */
router.post(LOGOUT_USER, userController.logoutUser);

/* /user/search/:userName */
router.get(SEARCH_USER, verifyToken, userController.searchUser);

/* /user/get-user/:userName */
router.get(GET_USER, userController.getUser);

module.exports = router;
