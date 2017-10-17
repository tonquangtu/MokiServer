const userService = require('../services/user-service');

const { constants, helpers } = global;

exports.userDetail = (req, res) => {
  let statusCode = 200;
  const reqData = req.body;
  if (!reqData) {
    statusCode = 404;
    helpers.sendResponse(res, statusCode, constants.response.paramValueInvalid);
  } else {
    userService.getUserDetail(req.user.id, reqData.userId, (response) => {
      if (response.code === constants.response.userNotFound.code ||
        response.code === constants.response.paramValueInvalid.code) {
        statusCode = 404;
      } else if (response.code === constants.response.systemError.code) {
        statusCode = 500;
      }
      helpers.sendResponse(res, statusCode, response);
    });
  }
};

exports.getSetting = (req, res) => {
  userService.getSetting(req.user.id, (responseData) => {
    helpers.sendResponse(res, constants.statusCode.ok, responseData);
  });
};

exports.setUserInfo = (req, res) => {
  const data = req.body;

  if (data.status !== undefined) {
    if (!Number.isInteger(data.status)) {
      helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramTypeInvalid);
    } else if (data.status !== 0 && data.status !== 1) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramValueInvalid,
      );
    }
  }
  userService.setUserInfo(data, req.user.id, (responseData) => {
    helpers.sendResponse(res, constants.statusCode.ok, responseData);
  });
};

