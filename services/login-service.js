const userRepo = require('../repositories/user-repository');
const deviceRepo = require('../repositories/device-repository');
const userService = require('../services/user-service');
// const pushNotificationService = require('../services/push-notification-service');

const { constants, helpers, logger } = global;

exports.login = (phoneNumber, password, callback) => {
  let loginSuccess = false;
  let response = {};
  const promise = userRepo.getUserByPhoneNumber(phoneNumber);
  promise.then((user) => {
    if (!user) {
      response = constants.response.userNotFound;
      return null;
    }
    if (!helpers.validPassword(password, user.hash_password)) {
      response = constants.response.wrongPassword;
      return null;
    }
    const expiredDate = helpers.getExpiredDate(2);
    const payload = {
      isLogin: true,
      user: {
        id: user.id,
        username: user.username,
        phoneNumber: user.phone_number,
        role: user.role,
        url: user.url,
        avatar: user.avatar,
      },
      expiredAt: expiredDate,
    };
    const token = helpers.encodeToken(payload);
    return userRepo.findAndUpdateUser(user.id, { token }, { new: true });
  }).then((user) => {
    if (user) {
      loginSuccess = true;
      response = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: {
          token: user.token,
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        },
      };
    }
    return callback(loginSuccess, response);
  }).catch((err) => {
    logger.error('Error at function login in login-service.\n', err);
    loginSuccess = false;
    return callback(loginSuccess, constants.response.systemError);
  });
};

exports.logout = (userId, callback) => {
  if (!helpers.isValidId(userId)) {
    callback(constants.response.paramValueInvalid);
    return;
  }

  const updateUserPromise = userRepo.findAndUpdateUser(userId, { token: null }, null);
  const updateDevicePromise = deviceRepo.findAndUpdateDevice(userId, { device_token: null }, null);

  Promise
    .all([updateUserPromise, updateDevicePromise])
    .then((results) => {
      if (results && results.length > 0 && results[0]) {
        return callback(constants.response.ok);
      }

      return callback(constants.response.userNotFound);
    })
    .catch((err) => {
      logger.error('Error at function logout in login-service.\n', err);
      return callback(constants.response.systemError);
    });
};
