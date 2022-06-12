const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');

require('dotenv').config();
require('./src/database/Connector').connect();

const {
  ROUTERS_USER: { USER_ROUTER },
  ROUTERS_MAIL: { MAIL_ROUTER },
  ROUTERS_ADMIN: { ADMIN_ROUTER },
} = require('./src/constants/Routes');
const usersRouter = require('./src/routes/User');
const adminRouter = require('./src/routes/Admin');
const mailRouter = require('./src/routes/Mail');

const verifyToken = require('./src/middlewares/verifyToken');
const isAdminRole = require('./src/middlewares/IsAdminRole');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: process.env.CLIENT_URL,
}));

app.use(USER_ROUTER, usersRouter);
app.use(MAIL_ROUTER, mailRouter);
app.use(ADMIN_ROUTER, verifyToken, isAdminRole, adminRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
