const userService = require('../services/user-service');

const { constants, helpers } = global;

exports.userDetail = (req, res) => {
  let statusCode = 200;
  const reqData = req.body;
  if (!reqData) {
    statusCode = 404;
    const response = helpers.getParamValueInvalidResponse();
    helpers.sendResponse(res, statusCode, response);
  } else {
    userService.getUserDetail(req.user.id, reqData.userId, (response) => {
      if (response.code === constants.response.userNotFound.code) {
        statusCode = 404;
      } else if (response.code === constants.response.systemError.code) {
        statusCode = 500;
      }
      helpers.sendResponse(res, statusCode, response);
    });
  }
};
