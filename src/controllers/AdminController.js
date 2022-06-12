const bcrypt = require('bcrypt');
const userModel = require('../models/User');
const { ERRORS: { USER_NOT_FOUND, VALIDATION_ERROR, USERS_NOT_FOUND }, STATUS: { FAIL, SUCCESS } } = require('../constants/Validation');
const { ROLES: { USER, ADMIN } } = require('../constants/Roles');
const validationService = require('../services/ValidationService');
const { prepareUpdateData } = require('../utils/PreparationUtils');

const getUsersList = async (req, res) => {
  const response = {
    status: FAIL,
    errors: [],
    result: null,
  };
  try {
    const usersList = await userModel.find({ role: USER }).select('-password');
    response.status = SUCCESS;
    response.result = usersList;
    return res.status(200).json(response);
  } catch (err) {
    return res.status(400).send(response);
  }
};

const getAdminsList = async (req, res) => {
  try {
    const adminsList = await userModel.find({ role: ADMIN }).select('-password');
    if (adminsList.toString().length === 0) return res.status(204).send('Admins not found');
    return res.status(200).json(adminsList);
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userName, password, userIdToDelete } = req.body;
    const hashedPassword = await bcrypt.hashSync(password, process.env.BCRYPT_SALT);
    const userAdmin = await userModel.find({ userName, password: hashedPassword, role: ADMIN });
    if (!userAdmin) return res.status(404).send('Admin does not exist');
    const userToDelete = await userModel.findOneAndDelete({ _id: userIdToDelete });
    if (!userToDelete) return res.status(404).send(USER_NOT_FOUND);
    return res.status(200).send({ ...userToDelete.toJSON(), result: 'OK' });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const editUser = async (req, res) => {
  const response = {
    status: FAIL,
    errors: [],
    result: null,
  };
  const validationResult = await validationService.validateUpdateData(req.body);
  if (validationResult.status === FAIL) {
    response.errors.push(validationResult.errors);
    return res.status(400).json(response);
  }
  try {
    const {
      preparedUserName, preparedFullName, preparedEmail, preparedID,
    } = prepareUpdateData(req.body);
    await userModel.updateOne({ _id: preparedID },
      { userName: preparedUserName, fullName: preparedFullName, email: preparedEmail });
    response.status = SUCCESS;
    return res.status(200).json(response);
  } catch (err) {
    response.errors.push(VALIDATION_ERROR);
    return res.status(400).send(response);
  }
};

module.exports = {
  getUsersList,
  getAdminsList,
  deleteUser,
  editUser,
};
