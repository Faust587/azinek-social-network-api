const express = require('express');
const {
  ROUTERS_ADMIN: {
    ADMIN_LIST, USER_LIST, DELETE_USER, EDIT_USER,
  },
} = require('../constants/Routes');
const adminController = require('../controllers/AdminController');

const router = express.Router();

router.get(ADMIN_LIST, adminController.getAdminsList);
router.get(USER_LIST, adminController.getUsersList);
router.delete(DELETE_USER, adminController.deleteUser);
router.put(EDIT_USER, adminController.editUser);

module.exports = router;
