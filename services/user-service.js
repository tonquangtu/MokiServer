const userRepo = require('../repositories/user-repository');

const { constants, helpers, _ } = global;

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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
    return callback(constants.response.systemError);
  });
};

exports.setUserInfo = (data, userId, callback) => {
  const updateData = {};
  if (data.email !== null) {
    updateData.email = data.email;
  }
  if (data.username !== null) {
    updateData.username = data.username;
  }
  if (data.status !== null) {
    updateData.status = data.status;
  }
  if (data.avatar !== null) {
    updateData.avatar = data.avatar;
  }
  if (data.address !== null && data.city !== null) {
    updateData.addresses.push({
      address: data.address,
      city: data.city,
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
  }).catch(err => callback(constants.response.systemError));
};
