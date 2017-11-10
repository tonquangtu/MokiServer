const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const jwtConfig = require('../config/jwt-config');
const dotEnv = require('dotenv');
const bcrypt = require('bcrypt-nodejs');
const constants = require('../constants/constants');
const moment = require('moment');
const google = require('googleapis');
const fs = require('fs');
const logger = require('./logger');

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

exports.isValidExpiredDate = (expiredDate) => {
  if (!this.isExist(expiredDate)) {
    return false;
  }

  let expiredAt = expiredDate;
  if (Object.prototype.toString.call(expiredDate) !== '[object Date]') {
    expiredAt = new Date(expiredDate);
  }

  const now = moment(new Date());
  const expired = moment(expiredAt);

  const diff = now.diff(expired);
  if (Number.isNaN(diff)) {
    return false;
  }

  return diff < 0;
};

exports.isValidExpiredDate = (expiredDate) => {
  if (!this.isExist(expiredDate)) {
    return false;
  }

  const now = moment(new Date());
  const expired = moment(expiredDate);

  const diff = now.diff(expired);
  if (Number.isNaN(diff)) {
    return false;
  }

  return diff < 0;
};

exports.isValidDeviceId = deviceId => !(deviceId && deviceId.length < 10);

exports.getObjectType = aObject => Object.prototype.toString.call(aObject);

exports.uploadFile = (auth, files, callback) => {
  const service = google.drive(constants.googleDriver.version);
  const fileUrlList = [];
  let count = 0;
  files.forEach((file) => {
    service.files.create({
      resource: {
        name: file.fileName,
        mimeType: file.type,
        parents: [
          constants.googleDriver.folderShare
        ],
      },
      media: {
        mimeType: file.type,
        body: fs.createReadStream(file.path),
      },
      auth,
    }, (err, response) => {
      if (err) {
        logger.error('Error when save image to driver.\n', err);
      }
      count += 1;
      fileUrlList.push(constants.googleDriver.pathFile.replace('fileId', response.id));
      if (count === files.length) {
        return callback(fileUrlList);
      }
    });
  });
};

exports.uploadFileWithBase64 = (auth, files, type, callback) => {
  const service = google.drive(constants.googleDriver.version);
  const fileUrlList = [];
  let count = 0;
  files.forEach((file) => {
    const buf = Buffer.from(file, 'base64');
    service.files.create({
      resource: {
        name: `img_${new Date().getTime()}`,
        mimeType: type,
        parents: [
          constants.googleDriver.folderShare
        ],
      },
      media: {
        mimeType: type,
        body: buf,
      },
      auth,
    }, (err, response) => {
      if (err) {
        logger.error('Error when save image to driver.\n', err);
      }
      count += 1;
      fileUrlList.push(constants.googleDriver.pathFile.replace('fileId', response.id));
      if (count === files.length) {
        return callback(fileUrlList);
      }
    });
  });
};

exports.deleteFile = (auth, fileIds, callback) => {
  let count = 0;
  const service = google.drive(constants.googleDriver.version);
  fileIds.forEach((fileId) => {
    service.files.delete({
      fileId,
    }, (err, response) => {
      count += 1;
      if (err) {
        logger.error('Error when save image to driver.\n', err);
      }
    });
    if (count === fileIds.length) {
      callback();
    }
  });
};
