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

exports.isValidId = id => id && id.match(/^[0-9a-fA-F]{24}$/);

exports.decodeToken = token => jwt.decode(token, jwtConfig.secretOrKey);

exports.getUserIdFromToken = (token) => {
  let userId;
  if (token) {
    const user = this.decodeToken(token);
    userId = user ? user.user.id : 0;
  } else {
    userId = 0;
  }
  return userId;
};
