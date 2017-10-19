const userService = require('../services/user-service');

const { constants, helpers } = global;

exports.userDetail = (req, res) => {
  const reqData = req.body;
  if (!reqData) {
    helpers.sendResponse(res, constants.response.paramValueInvalid);
  } else {
    userService.getUserDetail(req.user.id, reqData.userId, (response) => {
      helpers.sendResponse(res, response);
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
  if (!data) {
    helpers.sendResponse(
      res, constants.statusCode.notFound,
      constants.response.paramValueInvalid,
    );
  } else if (helpers.isExist(data.status)) {
    const statusValid = helpers.validInteger(data.status);
    if (statusValid === null) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramTypeInvalid,
      );
    } else if (statusValid !== 0 && statusValid !== 1) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramValueInvalid,
      );
    }
  }
  userService.setUserInfo(
    data, req.user.id,
    (responseData) => {
      helpers.sendResponse(
        res, constants.statusCode.ok,
        responseData,
      );
    },
  );
};

exports.setSetting = (req, res) => {
  const data = req.body;
  if (!data) {
    helpers.sendResponse(
      res, constants.statusCode.notFound,
      constants.response.paramValueInvalid,
    );
  } else {
    const {
      likeValid, commentValid, announcementValid, soundOnValid, soundDefaultValid,
    } = validateSettingParams(data);
    const dataValid = {
      like: likeValid,
      comment: commentValid,
      announcement: announcementValid,
      soundOn: soundOnValid,
      soundDefault: soundDefaultValid,
    };

    userService.setSetting(
      dataValid, req.user.id,
      (responseData) => {
        helpers.sendResponse(
          res, constants.statusCode.ok,
          responseData,
        );
      },
    );
  }
};

exports.getFollowList = (req, res, type) => {
  const data = req.body;
  if (!data) {
    helpers.sendResponse(
      res, constants.statusCode.notFound,
      constants.response.paramValueInvalid,
    );
  } else {
    const {
      userId, index, count, token,
    } = data;
    const countValid = helpers.validInteger(count);
    const indexValid = helpers.validInteger(index);

    if (!helpers.isExist(userId) || !helpers.isExist(index) || !helpers.isExist(count)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramNotEnough,
      );
    } else if (countValid === null || indexValid === null) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramTypeInvalid,
      );
    } else if (!helpers.isValidId(userId) || countValid <= 0 || indexValid < 0) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramValueInvalid,
      );
    } else {
      const user = helpers.getUserFromToken(token);
      const myId = user ? user.id : 0;

      userService.getFollowList({
        userId,
        myId,
        index: indexValid,
        count: countValid,
        type,
      }, (responseData) => {
        helpers.sendResponse(
          res, constants.statusCode.ok,
          responseData,
        );
      });
    }
  }
};

function validateSettingParams(data) {
  const {
    like, comment, announcement, soundOn, soundDefault,
  } = data;
  const { turnOn } = constants.pushSetting;
  const likeValid = helpers.isExist(like) ? like : turnOn;
  const commentValid = helpers.isExist(comment) ? comment : turnOn;
  const announcementValid = helpers.isExist(announcement) ? announcement : turnOn;
  const soundOnValid = helpers.isExist(soundOn) ? soundOn : turnOn;
  const soundDefaultValid = helpers.isExist(soundDefault) ? soundDefault : turnOn;

  return {
    likeValid, commentValid, announcementValid, soundOnValid, soundDefaultValid,
  };
}

