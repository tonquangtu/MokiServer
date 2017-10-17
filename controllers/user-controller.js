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

exports.setSetting = (req, res) => {
  const data = req.body;
  userService.setSetting(validateSettingParams(data), req.user.id, (responseData) => {
    helpers.sendResponse(res, constants.statusCode.ok, responseData);
  });
};

function validateSettingParams(data) {
  const like = data.like !== undefined ? data.like : 1;
  const comment = data.comment !== undefined ? data.comment : 1;
  const announcement = data.announcement !== undefined ? data.announcement : 1;
  const soundOn = data.soundOn !== undefined ? data.soundOn : 1;
  const soundDefault = data.soundDefault !== undefined ? data.soundDefault : 1;

  return {
    like, comment, announcement, soundOn, soundDefault,
  };
}

