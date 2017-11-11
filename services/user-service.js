const userRepo = require('../repositories/user-repository');
const countryRepo = require('../repositories/country-repository');

const {
  constants, helpers, _, logger,
} = global;

exports.getOtherUserDetail = (myId, otherUserId, callback) => {
  let response;
  const otherUserPromise = userRepo.getUserById(otherUserId);
  const userPromise = userRepo.getUserById(myId);
  Promise.all([
    otherUserPromise,
    userPromise,
  ]).then((result) => {
    const otherUser = result[0];
    const user = result[1];
    if (!otherUser || !user) {
      return callback(constants.response.userNotFound);
    }

    const isFollowed = _.findIndex(user.follows_to, { user: otherUser._id }) !== -1 ? 1 : 0;
    const isBlocked = _.findIndex(user.blocks, { user: otherUser._id }) !== -1 ? 1 : 0;
    const data = {
      id: otherUserId,
      username: otherUser.username,
      url: otherUser.url,
      status: otherUser.status,
      avatar: otherUser.avatar,
      address: null,
      city: null,
      followed: isFollowed,
      is_blocked: isBlocked,
      default_address: null,
    };
    response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data,
    };
    return callback(response);
  }).catch((err) => {
    logger.error('Error at function getOtherUserDetail in user-service.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.getMyDetail = (myId, callback) => {
  let response;
  const promise = userRepo.getUserById(myId);
  promise.then((user) => {
    if (!user) {
      return callback(constants.response.userNotFound);
    }
    const addressItem = _.find(user.addresses, { _id: user.default_address });
    const userAddress = addressItem ? addressItem.address : null;
    const userCity = addressItem ? addressItem.address : null;
    const data = {
      id: user.id,
      username: user.username,
      url: user.url,
      status: user.status,
      avatar: user.avatar,
      address: userAddress,
      city: userCity,
      followed: 0,
      is_blocked: 0,
      default_address: {
        address_id: user.default_address,
        address: userAddress,
      },
    };
    response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data,
    };
    return callback(response);
  }).catch((err) => {
    logger.error('Error at function getMyDetail in user-service.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.getUserDetail = (myId, otherUserId, callback) => {
  if (!otherUserId || myId === otherUserId) {
    return this.getMyDetail(myId, callback);
  } else if (!helpers.isValidId(otherUserId)) {
    return callback(constants.response.paramValueInvalid);
  }
  return this.getOtherUserDetail(myId, otherUserId, callback);
};

exports.updateUser = (userId, updateData, options, callback) => {
  if (!helpers.isValidId(userId)) {
    return callback(constants.response.paramValueInvalid);
  }
  const promise = userRepo.findAndUpdateUser(userId, updateData, options);
  promise.then((user) => {
    if (!user) {
      return callback(constants.response.userNotFound);
    }
    const response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: null,
    };
    return callback(response);
  }).catch((err) => {
    logger.error('Error at function updateUser in user-service.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.getSetting = (userId, callback) => {
  const promise = userRepo.getPushSetting(userId);
  let pushSetting;

  promise.then((userSettings) => {
    if (userSettings.length > 0) {
      pushSetting = userSettings[0].push_setting;
      const responseData = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: {
          like: pushSetting.like,
          comment: pushSetting.comment,
          announcement: pushSetting.announcement,
          soundOn: pushSetting.sound_on,
          soundDefault: pushSetting.sound_default,
        },
      };
      return callback(responseData);
    }

    const { turnOn } = constants.pushSetting;
    const pushSettingData = {
      user: userId,
      push_setting: {
        like: turnOn,
        comment: turnOn,
        announcement: turnOn,
        sound_on: turnOn,
        sound_default: turnOn,
      },
    };
    return userRepo.addPushSetting(pushSettingData);
  }).then((newUserSetting) => {
    const newPushSetting = newUserSetting.push_setting;
    const responseData = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: {
        like: newPushSetting.like,
        comment: newPushSetting.comment,
        announcement: newPushSetting.announcement,
        soundOn: newPushSetting.sound_on,
        soundDefault: newPushSetting.sound_default,
      },
    };
    return callback(responseData);
  }).catch((err) => {
    logger.error('Error at function getSetting.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.setUserInfo = (data, userId, callback) => {
  const {
    email, username, status, avatar, address, city,
  } = data;
  const updateData = {};

  if (helpers.isExist(email)) {
    updateData.email = email;
  }
  if (helpers.isExist(username)) {
    updateData.username = username;
  }
  if (helpers.isExist(status)) {
    updateData.status = helpers.validInteger(status);
  }
  if (helpers.isExist(avatar)) {
    updateData.avatar = avatar;
  }
  if (helpers.isExist(address) && helpers.isExist(city)) {
    updateData.addresses.push({
      address,
      city,
    });
  }
  const promise = userRepo.findAndUpdateUser(userId, updateData, { new: true });
  promise.then((newUser) => {
    const responseData = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: {
        avatar: newUser.avatar,
      },
    };

    return callback(responseData);
  }).catch((err) => {
    logger.error('Error at function setUserInfo.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.setSetting = (data, userId, callback) => {
  const {
    like, comment, announcement, soundOn, soundDefault,
  } = data;
  const userSettingData = {
    user: userId,
    push_setting: {
      like,
      comment,
      announcement,
      sound_on: soundOn,
      sound_default: soundDefault,
    },
  };
  const promise = userRepo.findAndUpdateUserSetting(userId, userSettingData, { new: true });
  promise.then((newUserSetting) => {
    const newPushSetting = newUserSetting.push_setting;
    const responseData = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: {
        like: newPushSetting.like,
        comment: newPushSetting.comment,
        announcement: newPushSetting.announcement,
        soundOn: newPushSetting.sound_on,
        soundDefault: newPushSetting.sound_default,
      },
    };

    return callback(responseData);
  }).catch((err) => {
    logger.error('Error at function setSetting.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.getFollowList = (data, callback) => {
  const {
    userId, myId, index, count, type,
  } = data;
  const promise = userRepo.getUserFollows(userId, index, count, type);
  let followList;

  promise.then((user) => {
    if (!user) {
      return callback(constants.response.userNotFound);
    }

    followList = (type === constants.followedField) ? user.follows_from : user.follows_to;
    if (myId === 0) {
      const followArray = [];

      followList.forEach((follower) => {
        if (follower.user) {
          followArray.push({
            id: follower.user.id,
            username: follower.user.username,
            avatar: follower.user.avatar,
            followed: 0,
          });
        }
      });
      const responseData = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: followArray,
      };

      return callback(responseData);
    }
    return userRepo.getUserFollows(myId, 0, 0, constants.followingField);
  }).then((myInfo) => {
    const followArray = [];

    followList.forEach((follower) => {
      if (follower.user) {
        const follow = _.find(myInfo.follows_to, user => user.user.id === follower.user.id);
        const followed = follow ? 1 : 0;

        followArray.push({
          id: follower.user.id,
          username: follower.user.username,
          avatar: follower.user.avatar,
          followed,
        });
      }
    });
    const responseData = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: followArray,
    };

    return callback(responseData);
  }).catch((err) => {
    logger.error('Error at function getFollowList.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.getListProvince = (callback) => {
  const promise = countryRepo.getProvinces();

  promise.then((provinces) => {
    const responseProvinces = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: provinces.provinces,
    };
    return callback(responseProvinces);
  }).catch((err) => {
    logger.error('Error at function getListProvince.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.getListDist = (callback) => {
  const promise = countryRepo.getDistricts();
  const distArray = [];

  console.log('Zo getListDist');

  promise.then((dists) => {
    const responseDist = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: dists[0].districts,
    };
    return callback(responseDist);
  }).catch((err) => {
    logger.error('Error at function getListDist.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.getListDistByParentId = (parentIdValid, callback) => {
  console.log('ParentId : ', parentIdValid);

  const promise = countryRepo.getListDistrictByParentId(parentIdValid);

  promise.then((listDistByParentId) => {
    const responseDistByParentId = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: listDistByParentId[0].provinces.districts,
    };
    return callback(responseDistByParentId);
  }).catch((err) => {
    logger.error('Error at function getListDistByParentId.\n', err);
    return callback(constants.response.systemError);
  });
};
