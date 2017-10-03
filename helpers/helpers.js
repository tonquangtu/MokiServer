const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const jwtConfig = require('../config/jwt-config');


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
