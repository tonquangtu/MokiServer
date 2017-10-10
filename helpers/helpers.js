const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const jwtConfig = require('../config/jwt-config');
const dotEnv = require('dotenv');
const bcrypt = require('bcrypt-nodejs');
const constants = require('../constants/constants');

dotEnv.config();

exports.connectDb = () => {
  mongoose.connect(process.env.DB_URL, {
    useMongoClient: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error'));
};

exports.sendResponse = (res, statusCode, response) => {
  res.status(statusCode).json(response);
};

exports.encodeToken = payload => jwt.encode(payload, jwtConfig.secretOrKey);

exports.generateHashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

exports.validPassword =
  (reqPassword, hashPassword) => bcrypt.compareSync(reqPassword, hashPassword);

exports.getSystemErrorResponse = () => {
  return {
    code: constants.response.systemError.code,
    message: constants.response.systemError.message,
    data: null,
  };
};

exports.getUserNotFoundResponse = () => {
  return {
    code: constants.response.userNotFound.code,
    message: constants.response.userNotFound.message,
    data: null,
  };
};

exports.getParamValueInvalidResponse = () => {
  return {
    code: constants.response.paramValueInvalid.code,
    message: constants.response.paramValueInvalid.message,
    data: null,
  };
};
