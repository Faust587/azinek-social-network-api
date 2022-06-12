const ROUTERS_USER = {
  USER_ROUTER: '/user',
  REGISTRATION: '/register',
  LOGIN: '/login',
  LOGOUT_USER: '/logout/:token',
  REFRESH_USER_TOKEN: '/refresh',
  SEARCH_USER: '/search/:userName',
  UPDATE_USER: '/update',
  GET_USER: '/get-user/:userName',
};

const ROUTERS_ADMIN = {
  ADMIN_ROUTER: '/admin',
  ADMIN_LIST: '/admins-list',
  USER_LIST: '/users-list',
  DELETE_USER: '/delete-user',
  EDIT_USER: '/edit-user',
};

const ROUTERS_MAIL = {
  MAIL_ROUTER: '/mail',
  RESET_PASSWORD: '/reset-password',
};

module.exports = { ROUTERS_USER, ROUTERS_ADMIN, ROUTERS_MAIL };
