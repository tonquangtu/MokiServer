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

exports.getFollowList = (req, res, type) => {
  const data = req.body;
  if (data.userId === undefined || data.index === undefined || data.count === undefined) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramNotEnough);
  } else if (!Number.isInteger(data.count) || !Number.isInteger(data.index)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramTypeInvalid);
  } else if (!validateValueFollowListParams(data)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    const { userId, index, count } = validateValueFollowListParams(data);
    userService.getFollowList({
      userId,
      myId: helpers.getUserIdFromToken(data.token),
      index,
      count,
      type,
    }, (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }
};

function validateValueFollowListParams(followedParams) {
  const { userId, index, count } = followedParams;
  if (!helpers.isValidId(userId) || count <= 0 || index < 0) {
    return false;
  }

  return { userId, index, count };
}
