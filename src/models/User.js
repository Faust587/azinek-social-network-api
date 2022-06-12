const mongoose = require('mongoose');
const { STATUS } = require('../constants/Status');
const { ROLES: { USER } } = require('../constants/Roles');

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    userName: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    email: { type: String, index: { unique: true }, required: true },
    password: { type: String, required: true },
    confirmationCode: { type: String, required: false },
    status: { type: String, required: true, default: STATUS.INVITED },
    role: { type: String, required: true, default: USER },
    resetPasswordToken: { type: String, required: false, default: null },
  }, {
    toJSON: {
      transform(doc, ret) {
        const finalJSON = {
          ...ret,
        };
        delete finalJSON.password;
        return finalJSON;
      },
    },
  },
);
module.exports = model('User', userSchema);
