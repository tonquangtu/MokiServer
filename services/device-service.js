const deviceRepo = require('../repositories/device-repository');

const { constants, helpers, logger } = global;

exports.updateOrAddDevice = (newDeviceParam) => {
  const {
    userId,
    deviceId,
    deviceType,
    deviceToken,
    expiredDate,
  } = newDeviceParam;
  let oldDeviceToken = null;
  let oldExpiredDate = null;
  if (deviceId && helpers.isExist(deviceType)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    deviceRepo
      .findDeviceByUserId(userId)
      .then((oldDevice) => {
        if (!oldDevice) {
          const newDeviceInfo = {
            userId,
            deviceId,
            deviceType,
            expiredDate,
            deviceToken: null,
          };
          return deviceRepo.addDevice(newDeviceInfo);
        }

        let updateDeviceInfo = null;
        if (oldDevice.device_id === deviceId && oldDevice.device_type === deviceType) {
          updateDeviceInfo = {
            expired_at: expiredDate,
          };
        } else {
          oldDeviceToken = oldDevice.device_token;
          oldExpiredDate = oldDevice.expired_at;
          updateDeviceInfo = {
            device_id: deviceId,
            device_type: deviceType,
            expired_at: expiredDate,
            device_token: deviceToken,
          };
        }
        oldDevice.set(updateDeviceInfo);
        return deviceRepo.saveDevice(oldDevice);
      })
      .then((addedOrSavedDevice) => {
        if (!oldDeviceToken) {
          return resolve(null);
        }

        return resolve({ oldDeviceToken, oldExpiredDate });
      })
      .catch((err) => {
        if (oldDeviceToken) {
          return resolve({ oldDeviceToken, oldExpiredDate });
        }

        logger.error('Error at function updateOrAddDevice in device-service\n', err);
        return reject(err);
      });
  });
};

exports.setDeviceToken = (deviceParam, callback) => {
  const {
    userId,
    deviceToken,
    deviceType,
  } = deviceParam;

  deviceRepo
    .findDeviceByUserId(userId)
    .then((device) => {
      if (!device) {
        return Promise.reject(constants.response.deviceNotFound);
      }

      if (device.device_token !== deviceToken || device.device_type !== deviceType) {
        const updateData = {
          device_token: deviceToken,
          device_type: deviceType,
        };
        device.set(updateData);
        return deviceRepo.saveDevice(device);
      }
      return device;
    })
    .then(savedDevice => callback(constants.response.ok))
    .catch((err) => {
      let errResponse = err;
      if (err !== constants.response.deviceNotFound) {
        errResponse = constants.response.systemError;
      }
      return callback(errResponse);
    });
};
