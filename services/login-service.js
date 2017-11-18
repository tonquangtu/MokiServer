const userRepo = require('../repositories/user-repository');
const deviceRepo = require('../repositories/device-repository');
const userService = require('../services/user-service');
const pushService = require('../services/push-notification-service');
const deviceService = require('../services/device-service');

const { constants, helpers, logger } = global;

exports.login = (phoneNumber, password, deviceParam, callback) => {
  let userTemp = null;
  let newDeviceId = null;
  let newDeviceType = null;
  let newExpiredDate = null;
  let loginSuccess = false;
  let response = {};

  if (deviceParam) {
    newDeviceId = deviceParam.deviceId;
    newDeviceType = deviceParam.deviceType;
  }

  userRepo
    .getUserByPhoneNumber(phoneNumber)
    .then((user) => {
      if (!user) {
        return Promise.reject(constants.response.userNotFound);
      }
      if (!helpers.validPassword(password, user.hash_password)) {
        return Promise.reject(constants.response.wrongPassword);
      }

      newExpiredDate = helpers.getExpiredDate(2);
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
        expiredAt: newExpiredDate,
      };
      const token = helpers.encodeToken(payload);
      user.set({ token });
      return userRepo.saveUser(user);
    })
    .then((user) => {
      if (!user) {
        return Promise.reject(constants.response.userNotFound);
      }

      userTemp = user;
      const newDeviceParam = {
        userId: user.id,
        deviceId: newDeviceId,
        deviceType: newDeviceType,
        deviceToken: null,
        expiredDate: newExpiredDate,
      };
      return deviceService.updateOrAddDevice(newDeviceParam);
    })
    .then((oldDeviceInfo) => {
      if (oldDeviceInfo) {
        const { oldDeviceToken, oldExpiredDate } = oldDeviceInfo;
        pushLoginNotification(oldDeviceToken, oldExpiredDate);
      }

      loginSuccess = true;
      response = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: {
          token: userTemp.token,
          id: userTemp.id,
          username: userTemp.username,
          avatar: userTemp.avatar,
        },
      };
      return callback(loginSuccess, response);
    })
    .catch((err) => {
      loginSuccess = false;

      if (err.code !== constants.response.systemError.code) {
        return callback(loginSuccess, err);
      }

      logger.error('Error at function login in login-service.\n', err);
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

function pushLoginNotification(deviceToken, expiredDate) {
  if (deviceToken && helpers.isValidExpiredDate(expiredDate)) {
    const notification = constants.push.otherPersonLogin;
    const notifyParam = {
      deviceToken,
      title: notification.title,
      body: notification.body,
      payload: {
        code: notification.code,
      },
      clickAction: 'LoginActivity',
    };

    pushService.pushNotification(notifyParam);
  }
}
