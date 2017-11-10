const notificationService = require('../services/notification-service');

const { constants, helpers } = global;

exports.getNotifications = (req, res) => {
  const reqData = req.body;
  if (!isEnoughNotifyParam(reqData)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const validParam = validNotifyParam(reqData);
    if (!validParam) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      validParam.userId = req.user.id;

      notificationService.getNotifications(validParam, (response) => {
        helpers.sendResponse(res, response);
      });
    }
  }
};

exports.setReadNotification = (req, res) => {
  const reqData = req.body;
  if (!reqData || !helpers.isExist(reqData.notificationId)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else if (!helpers.isValidId(reqData.notificationId)) {
    helpers.sendResponse(res, constants.response.paramValueInvalid);
  } else {
    notificationService.setReadNotification(req.user.id, reqData.notificationId, (response) => {
      helpers.sendResponse(res, response);
    });
  }
};

function isEnoughNotifyParam(reqData) {
  if (!reqData) {
    return false;
  }

  const {
    index,
    count,
    group,
  } = reqData;

  return helpers.isExist(index) && helpers.isExist(count) && helpers.isExist(group);
}

function validNotifyParam(reqData) {
  const {
    index,
    count,
    group,
  } = reqData;

  const validIndex = helpers.validNumber(index);
  const validCount = helpers.validNumber(count);
  const validGroup = helpers.validNumber(group);

  if (!helpers.isExist(validIndex) || validIndex < 0) {
    return null;
  }

  if (!helpers.isExist(validCount) || validCount < 1) {
    return null;
  }

  if (helpers.isExist(validGroup)
    && (validGroup === constants.notification.group.normal
      || validGroup === constants.notification.group.transaction)) {
    return {
      fromIndex: validIndex,
      limit: validCount,
      group: validGroup,
    };
  }

  return null;
}
