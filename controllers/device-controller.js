const deviceService = require('../services/device-service');

const { helpers, constants, logger } = global;

exports.setDeviceToken = (req, res) => {
  const reqData = req.body;
  const userId = req.user.id;
  const expiredDate = req.expiredAt;
  logger.info('Device token\n', reqData);

  if (!isEnoughDeviceParam(reqData)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const validDevice = validDeviceInfo(reqData.deviceToken, reqData.deviceType);

    if (!validDevice) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      const param = {
        userId,
        expiredDate,
        deviceToken: validDevice.deviceToken,
        deviceType: validDevice.deviceType,
      };
      deviceService.setDeviceToken(param, (response) => {
        helpers.sendResponse(res, response);
      });
    }
  }
};

function isEnoughDeviceParam(reqData) {
  if (!reqData) {
    return false;
  }

  return helpers.isExist(reqData.deviceToken)
    && helpers.isExist(reqData.deviceType);
}

function validDeviceInfo(deviceToken, deviceType) {
  if (!helpers.isExist(deviceToken) || !helpers.isExist(deviceType)) {
    return null;
  }

  if (helpers.getObjectType(deviceToken) !== '[object String]') {
    return null;
  }

  const validDeviceType = helpers.validNumber(deviceType);
  if (deviceToken.length < 1 || !helpers.isExist(validDeviceType)) {
    return null;
  }

  if (validDeviceType !== constants.device.type.ios
    && validDeviceType !== constants.device.type.android) {
    return null;
  }

  return {
    deviceToken,
    deviceType: validDeviceType,
  };
}
