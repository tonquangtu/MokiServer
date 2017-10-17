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

exports.setUserInfo = (req, res) => {
  const data = req.body;
  const { status } = validateUserInfoParams(data);

  if (status && !Number.isInteger(status)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramTypeInvalid);
  } else if (status && status !== 0 && status !== 1) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    userService.setUserInfo(validateUserInfoParams(data), req.user.id, (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }
};

function validateUserInfoParams(data) {
  const email = data.email !== undefined ? data.email : null;
  const username = data.username !== undefined ? data.username : null;
  const status = data.status !== undefined ? data.status : null;
  const avatar = data.avatar !== undefined ? data.avatar : null;
  const address = data.address !== undefined ? data.address : null;
  const city = data.city !== undefined ? data.city : null;

  return {
    email, username, status, avatar, address, city,
  };
}

