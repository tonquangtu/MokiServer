const userService = require('../services/user-service');

const { constants, helpers } = global;

exports.userDetail = (req, res) => {
  let statusCode = constants.statusCode.ok;
  const reqData = req.body;
  if (!reqData) {
    statusCode = constants.statusCode.notFound;
    helpers.sendResponse(res, statusCode, constants.response.paramValueInvalid);
  } else {
    userService.getUserDetail(req.user.id, reqData.userId, (response) => {
      if (response.code === constants.response.userNotFound.code ||
        response.code === constants.response.paramValueInvalid.code) {
        statusCode = constants.statusCode.notFound;
      } else if (response.code === constants.response.systemError.code) {
        statusCode = constants.statusCode.systemError;
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

