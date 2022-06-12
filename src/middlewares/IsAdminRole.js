const { STATUS: { FAIL }, ERRORS: { ACCESS_DENIED } } = require('../constants/Validation');
const { ROLES: { ADMIN } } = require('../constants/Roles');

module.exports = function isAdminRole(req, res, next) {
  const response = {
    status: FAIL,
    errors: [],
    result: null,
  };
  const { user } = req;
  if (user.role !== ADMIN) {
    response.errors.push(ACCESS_DENIED);
    return res.status(403).json(response);
  }
  return next();
};
