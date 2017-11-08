const deviceRepo = require('../repositories/device-repository');

const { helpers, logger } = global;

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
