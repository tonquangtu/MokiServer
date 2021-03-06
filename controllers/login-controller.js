const loginService = require('../services/login-service');

const { constants, helpers, logger } = global;

exports.login = (req, res) => {
  const deviceId = req.header(constants.device.deviceIdHeader);
  const deviceType = req.header(constants.device.deviceTypeHeader);

  const reqData = validateLoginData(req.body);
  const validDeviceParam = validateDeviceInfo(deviceId, deviceType);
  logger.info('valid device id\n', validDeviceParam);

  if (reqData) {
    const { phoneNumber, password } = reqData;
    loginService.login(phoneNumber, password, validDeviceParam, (loginSuccess, response) => {
      helpers.sendResponse(res, response);
    });
  } else {
    helpers.sendResponse(res, constants.response.userNotFound);
  }
};

exports.logout = (req, res) => {
  loginService.logout(req.user.id, (response) => {
    helpers.sendResponse(res, response);
  });
};

function validateLoginData(loginData) {
  if (!loginData.phoneNumber || !loginData.password) return null;
  const phoneNumber = loginData.phoneNumber.trim();
  const password = loginData.password.trim();
  if (phoneNumber.length < 7 || phoneNumber.length > 11 || password.length < 1) return null;
  // if (Number.isNaN(phoneNumber)) return null;
  return {
    password,
    phoneNumber,
  };
}

function validateDeviceInfo(deviceId, deviceType) {
  const validDeviceType = helpers.validNumber(deviceType);
  if (!helpers.isExist(validDeviceType)) {
    return null;
  }

  if (validDeviceType !== constants.device.type.ios
    && validDeviceType !== constants.device.type.android) {
    return null;
  }

  if (!helpers.isValidDeviceId(deviceId)) {
    return null;
  }

  return {
    deviceId,
    deviceType: validDeviceType,
  };
}
