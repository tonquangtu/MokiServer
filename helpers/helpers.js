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

exports.sendResponse = (res, response, statusCode = constants.statusCode.ok) => {
  res.status(statusCode).json(response);
};

exports.encodeToken = payload => jwt.encode(payload, jwtConfig.secretOrKey);

exports.decodeToken = token => jwt.decode(token, jwtConfig.secretOrKey);

exports.generateHashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

exports.validPassword =
  (reqPassword, hashPassword) => bcrypt.compareSync(reqPassword, hashPassword);

exports.isValidId = id => id && id.toString().match(/^[0-9a-fA-F]{24}$/);

exports.validString = (aString) => {
  if (!aString) {
    return null;
  }
  const trimString = aString.toString().trim();
  return trimString.length > 0 ? trimString : null;
};

exports.validNumber = (aNumber) => {
  if (!this.isExist(aNumber) || Number.isNaN(aNumber)) {
    return null;
  }
  return Number(aNumber);
};

exports.getUserFromToken = (token) => {
  if (!token) {
    return null;
  }
  const payload = this.decodeToken(token);
  if (!payload || !payload.isLogin || !payload.user) {
    return null;
  }

  // need to check this token is still valid or not ?
  if (!this.isValidId(payload.user.id)) {
    return null;
  }
  return payload.user;
};

exports.isExist = attribute => (attribute !== undefined) && (attribute !== null);

exports.validInteger = (aNumber) => {
  const number = this.validNumber(aNumber);

  if (number === null || !Number.isInteger(number)) {
    return null;
  }

  return number;
};

exports.getExpiredDate = (long) => {
  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() + long);
  return expiredDate;
};